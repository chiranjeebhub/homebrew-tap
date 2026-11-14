# Template for the cask in the chiranjeebhub/homebrew-tap tap. scripts/release-direct.sh fills
# in the version and checksum and pushes it there.
cask "clipstack" do
  version "1.3.2"
  sha256 "be6961f637adc1a37ecd3ced4add7e78e731879e0cf981cc8036bcae7f05f1f8"

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
