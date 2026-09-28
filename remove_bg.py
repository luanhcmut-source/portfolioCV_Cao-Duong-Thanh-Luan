from rembg import remove
from PIL import Image
import sys

def main():
    if len(sys.argv) != 3:
        print("Usage: python remove_bg.py <input> <output>")
        return
        
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    
    try:
        input_image = Image.open(input_path)
        output_image = remove(input_image)
        output_image.save(output_path)
        print(f"Successfully saved to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
