cask "hushtype" do
  version "0.3.2"
  sha256 "272184c0ccd1d0671fb832b1cf5118d7c5690e85806eb3c310b76a45765f8284"

  url "https://github.com/chiranjeebhub/hushtype/releases/download/v#{version}/Hushtype-#{version}.dmg"
  name "Hushtype"
  desc "Push-to-talk dictation with on-device transcription"
  homepage "https://github.com/chiranjeebhub/hushtype"

  livecheck do
    url "https://github.com/chiranjeebhub/hushtype/releases/latest/download/appcast.xml"
    strategy :sparkle, &:short_version
  end

  auto_updates true
  depends_on macos: :tahoe

  app "Hushtype.app"

  zap trash: [
    "~/Library/Application Support/Hushtype",
    "~/Library/Caches/app.hushtype.Hushtype",
    "~/Library/HTTPStorages/app.hushtype.Hushtype",
    "~/Library/Preferences/app.hushtype.Hushtype.plist",
    "~/Library/Saved Application State/app.hushtype.Hushtype.savedState",
  ]
end
