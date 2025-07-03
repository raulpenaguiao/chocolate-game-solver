
# The chocolate game

This is a simple two player game where each player takes turns removing squares from a chocolate bar.
Once one removes a square, all squares to the right and below are also removed.
The player who removes the last square loses.
This webpage allows you to understand if a given position is winning or losing, and also to explore the partitions of the chocolate bar.

# Things to do

Add a partition constructor for the $n \times m$ chocolate bar
Fix the partition explorer: clicking in a square will change the partition

# How to test website during development

Ideally one should test it in all possible conditions before pushing the code to the repository, as this push will thrigger the new version to be updated.

This can be done by opening the terminal and navigating to the directory where the file ``index.html`` is located, and then starting a server on an available port (for instance 8001)

```
CD path_to_directory
python -m http.server 8001
```

This is a usage example:

![image](https://github.com/user-attachments/assets/3935baa6-c843-4e5b-8b3a-410b85256305)

Afterwards one can open a browser and go to [http://localhost:8001/](http://localhost:8001/) to see the local version of the website.
Sometimes the browser does not update the style sheet on refresh, so make sure to refresh with ``ctrl`` + ``shift`` + ``F5`` in order to obtain the latest version.
Test the design with a window width of 900 up to 3200 pixels to make sure the design works as desired.
