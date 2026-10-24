cask "hushtype" do
  version "0.3.1"
  sha256 "622c8c9c55db254f556880f713694976890add6c4173b4bda2bc317edc1eba71"

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
