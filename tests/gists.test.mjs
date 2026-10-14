import test from "node:test";
import assert from "node:assert/strict";
import { chooseMainBackup, mainBackupKey } from "../src/lib/gists.ts";

const gist = (id) => ({ id, description: "Backup", updated_at: "2026-10-14T00:00:00Z", public: false });

test("adopts a single existing backup without creating another gist", () => {
  assert.equal(chooseMainBackup([gist("abc")], null), "abc");
  assert.equal(chooseMainBackup([], null), "");
});

test("multiple backups require a choice and preserve the remembered main gist", () => {
  const backups = [gist("newest"), gist("main"), gist("older")];
  assert.equal(chooseMainBackup(backups, null), "");
  assert.equal(chooseMainBackup(backups, "main"), "main");
  assert.equal(chooseMainBackup([...backups].reverse(), "main"), "main");
});

test("a deleted main gist does not silently switch to another collection", () => {
  assert.equal(chooseMainBackup([gist("a"), gist("b")], "deleted"), "");
  assert.equal(chooseMainBackup([gist("only")], "deleted"), "only");
});

test("main gist preferences are isolated by GitHub account", () => {
  assert.equal(mainBackupKey("Alice"), mainBackupKey("alice"));
  assert.notEqual(mainBackupKey("alice"), mainBackupKey("bob"));
});
