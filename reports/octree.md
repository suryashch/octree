# The Octree

How are modern video games able to render vast worlds, with crystal clear graphics? How does Youtube know your watch preferences- often better than you do? And how do engineers model precise airflow over complex wing shapes on a jet? These 3 seemingly unrelated questions are solved using this one common tool- the `Octree`.

![Octree Cover Photo](../public/img/octree-cover.png)

An `Octree` is a data structure used for efficient spatial querying. It is created by dividing a 3D space into small cubes, each of which sit nested within each other. This way, each level of the `octree` divides the space into 8 cubes.





Usage of an `octree` has been shown to improve Time Complexity from O(n) runtime to O(log n). Fundamentally, this means that increasing your space by a factor of 100, will only require on average log(100) ~= 4.6x higher resource usage from your computer.

`Octrees` are used widely in game development, Nearest-Neighbor algorithms, and Finite Element Analysis in CAD. Let's dive a little deeper into how they work.

## What is an Octree

An `octree` is a special type of `k-D` Tree where the number of dimensions = 3. It is constructed by repeatedly subdividing a 3D space into cubes. Each node of the `octree` contains 8 children- which refers to the 8 sub-cubes that sit within a larger cube.





## Example: Finding the Closest Objects in a Search Radius


## Other Use Cases


## Conclusion


### Links

