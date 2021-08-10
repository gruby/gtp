json.extract! item, :id, :title, :description, :duration, :web_added, :priority, :created_at, :updated_at
json.url item_url(item, format: :json)
