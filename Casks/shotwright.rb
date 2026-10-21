cask "shotwright" do
  version "0.1.0"
  sha256 "e8dc60db91ac494c5283bf4a1dd3fbff14140ac9a3d1b5eb15f64a9913c005a1"

  url "https://github.com/chiranjeebhub/Shotwright/releases/download/v#{version}/Shotwright-#{version}.dmg"
  name "Shotwright"
  desc "Menu bar screenshot, screen recording and annotation tool"
  homepage "https://github.com/chiranjeebhub/Shotwright"

  livecheck do
    url :url
    strategy :github_latest
  end

  auto_updates true
  depends_on macos: :sonoma

  app "Shotwright.app"

  zap trash: [
    "~/Library/Application Support/com.shotwright.app",
    "~/Library/Caches/com.shotwright.app",
    "~/Library/Containers/com.shotwright.app",
    "~/Library/HTTPStorages/com.shotwright.app",
    "~/Library/Preferences/com.shotwright.app.plist",
  ]
end
