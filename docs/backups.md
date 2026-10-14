# Settings backups

Open **Settings → Import and export** to save or load `updainium-settings.json`.
Backups contain tracked repository URLs, app identifiers, file and architecture
preferences, and startup/background settings. Release caches, downloaded files,
local file paths, and GitHub credentials are excluded. Imports validate the whole
backup before showing a preview. Merge keeps existing apps with matching URLs;
replace replaces the catalog after confirmation. Applying startup preferences is
optional. Review file preferences if the destination uses another operating system.
The versioned JSON format supports up to 5 MB.

## GitHub token connection

GitHub backups use a personal access token. Click **Create GitHub token** in
Settings to open GitHub's classic token creation page with the `gist` scope and
Updainium description selected. Choose an expiration, generate the token, paste
it into Settings, and click **Connect token**. A fine-grained token with Gists
read/write permission also works. No OAuth app registration is required.
See [GitHub's token documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

Tokens persist in this computer's OS credential store: macOS Keychain, Windows
Credential Manager, or Linux Secret Service. Linux needs an available Secret
Service (such as GNOME Keyring or KWallet). Saved credentials are loaded when
opening Settings, so restarting the app does not require signing in again.
Disconnect removes both saved and in-memory credentials. Tokens are never saved
in localStorage, sent to raw gist hosts, or included in JSON or gist exports.

## Gist migration

After connecting, choose **Secret** or **Public** for a new backup, or select a
previous backup to update it. Updates preserve the gist's existing visibility.
Updating asks for confirmation before replacing the remote backup. Backups use
secret gists by default: they are unlisted, but anyone with the link can read them.
Public gists are visible to everyone and discoverable on GitHub. On the
destination computer, sign in to the same account, select the backup, and choose
**Restore selected backup**. The same local import preview and confirmation apply.
Click **Open gist** to open the selected backup in your default browser, including
immediately after creating or updating it.
You can also enter a gist ID directly. To import someone else's catalog, paste a
gist URL or ID under **Import from a shared gist**, without signing in. Shared
imports default to keeping your startup preferences. Choose **Add to current apps**
to merge, or **Clean and import** to replace the catalog after confirmation.
Upload and restore are manual; the app does
not automatically overwrite remote or local changes. Disconnecting removes the
local session and saved credentials without deleting gists or revoking the token
on GitHub.

GitHub calls happen in the Rust backend to avoid WebView CORS restrictions.
Requests use HTTPS, timeouts, bounded responses, and disabled redirects.
See [GitHub's Gists API](https://docs.github.com/en/rest/gists/gists).

## Validation

```sh
node --test tests/backup.test.mjs
npm run check
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
```

Live token connection and gist operations require a real GitHub token. For a
manual check, export a catalog, merge and replace it from JSON, sign in, create a
gist, update it after confirmation, and restore it. Verify cancelling a file dialog
or import leaves the catalog untouched; malformed JSON shows an error; cancelling
restarting the app keeps your account connected;
both public and secret creation respect the chosen visibility; shared gist imports
work while disconnected; and disconnect requires signing in again.
