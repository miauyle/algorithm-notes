source "https://rubygems.org"

# Use DocSteer as a theme gem, as documented by the official installation guide.
gem "jekyll-theme-docsteer", "~> 1.0"

# Run the site locally with `bundle exec jekyll serve`
gem "jekyll", "~> 4.3"

group :jekyll_plugins do
  gem "jekyll-seo-tag",   "~> 2.8"
  gem "jekyll-sitemap",   "~> 1.4"
  gem "jekyll-feed",      "~> 0.17"
  gem "jekyll-paginate",  "~> 1.1"
end

# Windows / JRuby helpers
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end
gem "wdm", "~> 0.2.0", :platforms => [:mingw, :x64_mingw, :mswin]
gem "webrick", "~> 1.8"
