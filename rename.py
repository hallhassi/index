import os

dir_path = '/path/to/your/directory'

for filename in os.listdir(dir_path):
    name, ext = os.path.splitext(filename)
    os.rename(os.path.join(dir_path, filename), os.path.join(dir_path, name[:-2] + '-' + name[-2:] + ext))