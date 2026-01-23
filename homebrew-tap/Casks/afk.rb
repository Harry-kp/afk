cask "afk" do
  version "1.0.0"
  sha256 :no_check  # Update with actual SHA after first release

  url "https://github.com/Harry-kp/afk/releases/download/v#{version}/AFK_#{version}_universal.dmg"
  name "AFK"
  desc "Break reminder app - step away from your keyboard"
  homepage "https://github.com/Harry-kp/afk"

  livecheck do
    url :url
    strategy :github_latest
  end

  app "AFK.app"

  zap trash: [
    "~/Library/Application Support/com.afk.app",
    "~/Library/Caches/com.afk.app",
    "~/Library/Preferences/com.afk.app.plist",
    "~/Library/Saved Application State/com.afk.app.savedState",
  ]
end

