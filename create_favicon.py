import PIL.Image
import io
import os

# Create a simple 16x16 image for the favicon
img = PIL.Image.new('RGB', (16, 16), color = (52, 152, 219))  # Blue color for HETROFL

# Add an overlay pattern
for x in range(16):
    for y in range(16):
        if (x + y) % 4 == 0:
            img.putpixel((x, y), (41, 128, 185))  # Slightly darker blue

# Save as ICO
img_byte_arr = io.BytesIO()
img.save(img_byte_arr, format='ICO')

# Ensure directory exists
os.makedirs('hetrofl_system/gui/static/img', exist_ok=True)

# Save the file
with open('hetrofl_system/gui/static/img/favicon.ico', 'wb') as f:
    f.write(img_byte_arr.getvalue())

print("Favicon created successfully at hetrofl_system/gui/static/img/favicon.ico") 