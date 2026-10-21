cask "bucket-browser" do
  version "1.0.0"
  sha256 "7ea1fe2f10bdef187623013b8e7e416b9b57b1a8c497697165a2a8b0e93efb8b"

  url "https://github.com/chiranjeebhub/Bucket_Browser/releases/download/v#{version}/BucketBrowser.dmg"
  name "Bucket Browser"
  desc "Browse Amazon S3, Cloudflare R2 and S3-compatible buckets"
  homepage "https://chiranjeebhub.github.io/bucket-browser-site/"

  livecheck do
    url "https://chiranjeebhub.github.io/bucket-browser-site/appcast.xml"
    strategy :sparkle, &:short_version
  end

  auto_updates true
  depends_on macos: :sonoma

  app "Bucket Browser.app"

  zap trash: [
    "~/Library/Application Scripts/com.bucketbrowser.app",
    "~/Library/Containers/com.bucketbrowser.app",
  ]
end
