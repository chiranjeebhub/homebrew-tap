# Template for the cask in the chiranjeebhub/homebrew-tap tap. scripts/release-direct.sh fills
# in the version and checksum and pushes it there.
cask "clipstack" do
  version "1.3"
  sha256 "783f928c0f73f96b74ba9cd22369a8f968b2188508b085322099e512547af2d0"

  url "https://github.com/chiranjeebhub/ClipStack/releases/download/v#{version}/Clipstack-#{version}.dmg"
  name "Clipstack"
  desc "Clipboard history you can search and paste from the keyboard"
  homepage "https://github.com/chiranjeebhub/ClipStack"

  livecheck do
    url "https://github.com/chiranjeebhub/ClipStack/releases/latest/download/appcast.xml"
    strategy :sparkle, &:short_version
  end

  auto_updates true
  depends_on macos: :sonoma

  app "Clipstack.app"

  zap trash: [
    "~/Library/Application Scripts/com.chiranjeebhub.clipstack",
    "~/Library/Containers/com.chiranjeebhub.clipstack",
  ]
end
