import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, Scan, CheckCircle, XCircle, User } from "lucide-react";
import { toast } from "sonner";

interface DetectedFace {
  id: string;
  imageBase64: string;
  status: "known" | "unknown";
  name?: string;
}

export default function AddPhotosPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setSccanProgress] = useState(0);
  const [detectedFaces, setDetectedFaces] = useState<DetectedFace[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [folderPath, setFolderPath] = useState<string | null>(null);

  useEffect(() => {
    const handleProgress = (_event, progress) => {
      setSccanProgress(progress);
      if (progress >= 100) {
        setIsScanning(false);
        setShowResults(true);
      }
    };

    window.electronAPI.on('scan-progress', handleProgress);

    return () => {
      window.electronAPI.off('scan-progress', handleProgress);
    };
  }, []);



  const selectFolder = useCallback(async () => {
    try {
      const result = await window.electronAPI.selectPath();
      if (result) {
        setFolderPath(result);
        toast.success(`Folder selected: ${result}`);
      } else {
        toast.error("No folder selected.");
      }
    } catch (error: any) {
      toast.error(`Failed to select folder: ${error.message}`);
    }
  }, []);


  const handleUpload = async () => {
    if (!folderPath) {
      toast.error("Please select a folder first.");
      return;
    }

    try {
      const result = await window.electronAPI.operateOnPath(folderPath);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error || "Failed to upload photos.");
      }
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
    }
  };
  const handleDigitize = async () => {
    if (!folderPath) {
      toast.error("Please select a folder first.");
      return;
    }

    setIsScanning(true);
    setSccanProgress(0);
    setShowResults(false);

    try {
      const result = await window.electronAPI.operateOnPath(folderPath);
      console.log(result);

      // Set detected faces after completion
      setDetectedFaces(result);
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
      setIsScanning(false);
    }
  };


  const assignFace = (faceId: string) => {
    toast.info("In production, this would open a dialog to assign or create a profile");
  };

  const knownFaces = detectedFaces.filter((f) => f.status === "known");
  const unknownFaces = detectedFaces.filter((f) => f.status === "unknown");

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Add New Photos</h1>
          <p className="text-muted-foreground">
            Import photos and automatically detect faces
          </p>
        </div>

        <div className="space-y-6">
          {/* Upload Section */}
          <Card className="p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full bg-primary/10 p-6">
                <Upload className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Select Photos to Import
                </h2>
                <p className="text-muted-foreground">
                  Choose files or a folder from your computer
                </p>
              </div>
              <div className="flex gap-3">
                {/* <Button onClick={handleFileSelect}>
                  <Upload className="h-4 w-4 mr-2" />
                  Select Files
                </Button> */}
                <Button variant="outline" onClick={selectFolder}>
                  Select Folder
                </Button>
              </div>
            </div>
          </Card>

          {/* Digitize Section */}
          <Card className="p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full bg-accent/10 p-6">
                <Scan className="h-12 w-12 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Digitize Photos
                </h2>
                <p className="text-muted-foreground">
                  Detect faces and match with existing profiles
                </p>
              </div>

              {isScanning ? (
                <div className="w-full space-y-2">
                  <Progress value={scanProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    Scanning... {scanProgress}%
                  </p>
                </div>
              ) : (
                <Button variant="accent" onClick={handleDigitize} disabled={isScanning}>
                  <Scan className="h-4 w-4 mr-2" />
                  Start Digitization
                </Button>
              )}
            </div>
          </Card>

          {/* Results Section */}
          {showResults && (
            <div className="space-y-6">
              {/* Known Faces */}
              {knownFaces.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Recognized Faces ({knownFaces.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {knownFaces.map((face) => (
                      <div key={face.id} className="text-center space-y-2">
                        <img
                          src={face.imageBase64}
                          alt={face.name}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <Badge variant="secondary">{face.name}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Unknown Faces */}
              {unknownFaces.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Unknown Faces ({unknownFaces.length})
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click on a face to assign to an existing profile or create a new one
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {unknownFaces.map((face) => (
                      <button
                        key={face.id}
                        onClick={() => assignFace(face.id)}
                        className="text-center space-y-2 group cursor-pointer"
                      >
                        <div className="relative">
                          <img
                            src={face.imageBase64}
                            alt="Unknown"
                            className="w-full aspect-square object-cover rounded-lg transition-smooth group-hover:opacity-75"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
                            <div className="bg-card/90 rounded-full p-3">
                              <User className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">Unknown — click to assign</Badge>
                      </button>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
