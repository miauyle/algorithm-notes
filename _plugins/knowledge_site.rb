# Keep navigation.json as the single maintained site-navigation source.
require "json"
require "pathname"

module AlgorithmNotes
  class KnowledgeSite < Jekyll::Generator
    safe true
    priority :normal

    def generate(site)
      nav = JSON.parse(File.read(File.join(site.source, "navigation.json")))
      pages = nav.fetch("groups").flat_map { |group| group.fetch("pages") }
      refs = nav.fetch("reference_pages", [])
      all_pages = pages + refs

      routes = all_pages.to_h do |page|
        [page.fetch("path"), "/docs/#{File.basename(page.fetch("path"), ".md")}/"]
      end

      groups = nav.fetch("groups").map do |group|
        group.merge(
          "pages" => group.fetch("pages").map do |page|
            page.merge("url" => routes.fetch(page.fetch("path")))
          end
        )
      end
      reference_pages = refs.map do |page|
        page.merge("url" => routes.fetch(page.fetch("path")))
      end

      site.data["knowledge_map"] = {
        "groups" => groups,
        "reference_pages" => reference_pages
      }

      site.data["navigation"] = {
        "main" => [
          { "title" => "模式地图", "url" => "/#knowledge-map", "icon" => "fa-solid fa-diagram-project" },
          { "title" => "文档", "url" => "/docs/", "icon" => "fa-solid fa-book-open" },
          { "title" => "GitHub", "url" => "https://github.com/miauyle/algorithm-notes", "icon" => "fa-brands fa-github" }
        ],
        "sidebar" => groups.map do |group|
          item = {
            "title" => group.fetch("title"),
            "children" => group.fetch("pages").map do |page|
              { "title" => page.fetch("title"), "url" => page.fetch("url") }
            end
          }
          item["icon"] = group["icon"] if group["icon"]
          item["open"] = group["open"] if group.key?("open")
          item
        end
      }
    end
  end
end
