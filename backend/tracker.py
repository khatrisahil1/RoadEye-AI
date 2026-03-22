import math
from collections import OrderedDict

class CentroidTracker:
    """
    A lightweight, zero-dependency Object Tracker engineered specifically 
    to handle stateful tracking across stateless HTTP endpoints.
    Allows the backend to map unique string IDs to vehicles crossing the sensor.
    """
    def __init__(self, maxDisappeared=10, maxDistance=200):
        self.nextObjectID = 0
        self.objects = OrderedDict()
        self.classes = OrderedDict()
        self.disappeared = OrderedDict()
        self.maxDisappeared = maxDisappeared
        self.maxDistance = maxDistance

    def register(self, centroid, class_name):
        self.objects[self.nextObjectID] = centroid
        self.classes[self.nextObjectID] = class_name
        self.disappeared[self.nextObjectID] = 0
        self.nextObjectID += 1

    def deregister(self, objectID):
        del self.objects[objectID]
        del self.classes[objectID]
        del self.disappeared[objectID]

    def update(self, rects_with_classes):
        """
        rects_with_classes: list of tuples (x, y, w, h, class_name)
        """
        if len(rects_with_classes) == 0:
            for objectID in list(self.disappeared.keys()):
                self.disappeared[objectID] += 1
                if self.disappeared[objectID] > self.maxDisappeared:
                    self.deregister(objectID)
            return self.objects, self.classes

        inputCentroids = []
        inputClasses = []
        for (x, y, w, h, cls) in rects_with_classes:
            cX = float(x) # Center X is often what roboflow provides, or top-left. Assuming x,y is center if roboflow.
            cY = float(y)
            inputCentroids.append((cX, cY))
            inputClasses.append(cls)

        if len(self.objects) == 0:
            for i in range(0, len(inputCentroids)):
                self.register(inputCentroids[i], inputClasses[i])
        else:
            objectIDs = list(self.objects.keys())
            objectCentroids = list(self.objects.values())

            D = []
            for i in range(len(objectCentroids)):
                row = []
                for j in range(len(inputCentroids)):
                    d = math.hypot(objectCentroids[i][0] - inputCentroids[j][0], objectCentroids[i][1] - inputCentroids[j][1])
                    row.append(d)
                D.append(row)
            
            usedObjectIDs = set()
            usedInputIndices = set()
            
            distances = []
            for r in range(len(D)):
                for c in range(len(D[r])):
                    distances.append((D[r][c], r, c))
            distances.sort(key=lambda x: x[0])
            
            for d, r, c in distances:
                if d > self.maxDistance:
                    continue
                if r in usedObjectIDs or c in usedInputIndices:
                    continue
                
                objectID = objectIDs[r]
                self.objects[objectID] = inputCentroids[c]
                self.classes[objectID] = inputClasses[c]
                self.disappeared[objectID] = 0
                usedObjectIDs.add(r)
                usedInputIndices.add(c)
                
            for i, objectID in enumerate(objectIDs):
                if i not in usedObjectIDs:
                    self.disappeared[objectID] += 1
                    if self.disappeared[objectID] > self.maxDisappeared:
                        self.deregister(objectID)
            
            for j in range(len(inputCentroids)):
                if j not in usedInputIndices:
                    self.register(inputCentroids[j], inputClasses[j])
                    
        return self.objects, self.classes
