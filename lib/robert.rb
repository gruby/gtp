#GOO must be constant (capital letters)

def list_new_movies(from, to)
  new_ytmovies_ids = []
  init = 'https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCI5TWChOqtUKyWAbcuHsryA&maxResults=25&order=date&publishedAfter='
  init << CGI.escape(from)
  init << '&publishedBefore='
  init << CGI.escape(to)
  init << "&type=video&key=#{GOO}"
  JSON.parse(Net::HTTP.get(URI(init)))['items'].each do |jj|
    if jj['id']['kind'] == "youtube#video"
      new_ytmovies_ids << jj['id']['videoId']
    end      
  end
  new_ytmovies_ids.reverse
end

def movie_details(movie_id)
  details = {}
  res = JSON.parse(Net::HTTP.get(URI("https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=#{movie_id}&key=#{GOO}")))
  #Add YT id and duration of the movie to the result hash (details)
  details['id'] = res['items'][0]['id']
  details['duration'] = res['items'][0]["contentDetails"]["duration"]
  #extract snippet
  snippet = res['items'][0]['snippet']
  details['title'] = snippet['title']
  details['description'] = snippet['description']
  details['publishedAt'] = snippet['publishedAt']
  details
end

if list_new_movies('2021-07-01T11:42:55Z', '2021-07-21T11:42:55Z').size > 0
  hashes_of_movies = []
  list_new_movies('2021-07-01T11:42:55Z', '2021-07-21T11:42:55Z').each do |ci|
    hashes_of_movies << movie_details(ci)
  end
  hashes_of_movies.each do |m|
    unless Item.find_by web_id: m['id']
      Item.create(:web_id => m['id'], :title => CGI.unescapeHTML(m['title']), :description => CGI.unescapeHTML(m['description']), :duration => m['duration'], :web_added => m['publishedAt'])
    end
  end
end


=begin
Item.create(:title => Time.now.to_s)
p myreq('2021-07-01T11:42:55Z', '2021-07-21T11:42:55Z')
response = Net::HTTP.get(URI(myreq('2021-07-01T11:42:55Z', '2021-07-21T11:42:55Z')))
p ENV['GOOGLE_API_KEY']
response = Net::HTTP.get(URI('https://youtube.googleapis.com/youtube/v3/search?channelId=UCI5TWChOqtUKyWAbcuHsryA&maxResults=25&publishedBefore=2021-07-20T11%3A42%3A55Z&key=AIzaSyDboCslB-MmvQiA9-NrEn-ulV9L0QYtmQ4'))
p JSON.parse(response)

open("#{Rails.root}/storage/test", 'a') {|f|
  f.puts movie_details('K-TRteugcac')
  #f.puts Net::HTTP.get(URI('https://wp.pl'))
}
=end
