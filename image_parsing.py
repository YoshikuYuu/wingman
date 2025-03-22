from google import genai
import requests
from PIL import Image
from io import BytesIO

client = genai.Client(api_key="AIzaSyByfScdoYEExsECaBOvaHqXEgOfI19uBOA")

url = "https://instagram.fphl1-1.fna.fbcdn.net/v/t51.2885-15/485067168_18512192929008508_1371499067344772488_n.jpg?stp=dst-jpg_e35_s1080x1080_sh0.08_tt6&_nc_ht=instagram.fphl1-1.fna.fbcdn.net&_nc_cat=1&_nc_oc=Q6cZ2QHfDdt2gmQXKGZWgsu0AM3kWkB7FR0i62UNg74Z7zHh3SujFP9XKgIVapHeOXzlLDA&_nc_ohc=k2Jj_uOWwRUQ7kNvgEkCb1E&_nc_gid=zfCi6Rj8DV2VcmDLBgC0sA&edm=ANTKIIoBAAAA&ccb=7-5&oh=00_AYH4ydwuNgQeQhH2fG5dVy45wKqdN0hNExkKc1MtSuTjgw&oe=67E4EE2E&_nc_sid=d885a2"
response = requests.get(url)

if response.status_code == 200:
    # Open the image from the response content
    image = Image.open(BytesIO(response.content))

    # Save the image as a JPG file
    image.save("image.jpg", "JPEG")
    print("Image saved as image.jpg")
else:
    print("Failed to retrieve the image. Status code:", response.status_code)

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=["Tell me what's happening in this image!", image],
)

print(response.text)