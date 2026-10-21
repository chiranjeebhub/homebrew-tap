cask "sweep" do
  version "0.1.0"
  sha256 "7e57b07936e4ecd9fa3659d0ecead7ba58208bea43f4569ebfe063fdd83dbd04"

  url "https://github.com/chiranjeebhub/Sweep/releases/download/v#{version}/Sweep-#{version}.dmg"
  name "Sweep"
  desc "Native cleaner for caches, logs, leftovers and large files"
  homepage "https://github.com/chiranjeebhub/Sweep"

  livecheck do
    url :url
    strategy :github_latest
  end

  depends_on macos: :ventura

  app "Sweep.app"

  zap trash: [
    "~/Library/Caches/com.chiranjeebhub.sweep",
    "~/Library/HTTPStorages/com.chiranjeebhub.sweep",
    "~/Library/Preferences/com.chiranjeebhub.sweep.plist",
    "~/Library/Saved Application State/com.chiranjeebhub.sweep.savedState",
  ]
end
