import React, { useState, useRef, useEffect } from "react";
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import { useSocket } from '../Socket/SocketContext';



const ExerciseDetector = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();

  // Existing refs and state
  const [levelData, setLevelData] = useState(null);
  const [exerciseProgress, setExerciseProgress] = useState({});
  const [isLevelComplete, setIsLevelComplete] = useState(false);

  // Video and canvas refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Exercise counters
  const [squatCount, setSquatCount] = useState(0);
  const [leftCurlCount, setLeftCurlCount] = useState(0); 
  const [rightCurlCount, setRightCurlCount] = useState(0);
  const [jumpingJackCount, setJumpingJackCount] = useState(0);
  const [pushupCount, setPushupCount] = useState(0);
  const [plankTimer, setPlankTimer] = useState(0);
  const [legCount, setLegCount] = useState(0);
  const [armCount, setArmCount] = useState(0);

  // Exercise state refs
  const isSquatting = useRef(false);
  const isLeftCurlUp = useRef(false);
  const isRightCurlUp = useRef(false);
  const legRepDone = useRef(false);
  const armRepDone = useRef(false);
  const isLegsApart = useRef(false);
  const isArmsUp = useRef(false);
  const isPushingUp = useRef(false);
  const isInPlank = useRef(false);
  const plankStartTime = useRef(null);
  const plankInterval = useRef(null);

    
    

 

  
 
  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("Please login to access this level");
          navigate('/login');
          return;
        }
    
        const response = await axios.get(`http://localhost:5000/api/levels/${levelId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
    
        console.log('Level data response:', response.data);
    
        const levelData = response.data.data.level;
        if (!levelData || !levelData.exercises) {
          throw new Error('Invalid level data received');
        }
    
        setLevelData(levelData);
        
        // Initialize progress object with exact exercise names
        const initialProgress = {};
        levelData.exercises.forEach(exercise => {
          console.log(`Initializing progress for ${exercise.name} with target ${exercise.reps}`);

          initialProgress[exercise.name] = {
            current: 0,
            target: exercise.reps,
            type: 'reps'
          };
        });
        
        console.log("Initializing exercise progress:", initialProgress);
        setExerciseProgress(initialProgress);
    
      } catch (error) {
        console.error("Error fetching level data:", error);
        toast.error(error.response?.data?.message || "Failed to load level data");
        navigate('/levels');
      }
    };
  
    if (levelId) {
      fetchLevelData();
    }
  }, [levelId, navigate]);

  

  
  
  const updateExerciseProgress = (exerciseName, value) => {
    console.log(`Updating progress for ${exerciseName} with value ${value}`);
    
    setExerciseProgress(prev => {
      // Make sure we're updating the existing exercise entry
      if (!prev[exerciseName]) {
        console.log(`Exercise ${exerciseName} not found in progress state. Current state:`, prev);
        return prev;
      }
  
      const exercise = levelData.exercises.find(ex => ex.name === exerciseName);
      if (!exercise) {
        console.log(`Exercise ${exerciseName} not found in level data`);
        return prev;
      }
  
      console.log(`Found exercise in level data:`, exercise);
  
      // Update the existing exercise entry
      const updated = {
        ...prev,
        [exerciseName]: {
          ...prev[exerciseName],
          current: value
        }
      };
  
      console.log("Updated progress state:", updated);
  
      // Check if this exercise has reached its target
      if (value >= exercise.reps && !isLevelComplete) {
        console.log(`Exercise ${exerciseName} completed! Current: ${value}, Target: ${exercise.reps}`);
        
        // Check if ALL exercises have reached their targets
        const allComplete = levelData.exercises.every(ex => {
          const progress = updated[ex.name];
          const isComplete = progress && progress.current >= ex.reps;
          console.log(`Checking ${ex.name}: Current ${progress?.current}, Target ${ex.reps}, Complete: ${isComplete}`);
          return isComplete;
        });
  
        if (allComplete) {
          console.log("All exercises completed - triggering level completion");
          handleLevelComplete();
        }
      }
  
      return updated;
    });
  };

  useEffect(() => {
    if (socket) {
      socket.on('exercise_update', (data) => {
        // Handle updates from other users
        // You can show notifications or update UI accordingly
        if (data.userId !== user.id) {
          toast.info(`${data.userName} completed ${data.progress} ${data.exercise}!`);
        }
      });

      return () => {
        socket.off('exercise_update');
      };
    }
  }, [socket, user]);

  
  const animationFrameRef = useRef(null);

  const handleLevelComplete = async () => {
    try {
      setIsLevelComplete(true); // Set this first to stop pose detection
  
      // Cancel the animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
  
      // Stop the webcam stream
      if (videoRef.current && videoRef.current.srcObject) {
        
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
  
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/levels/${levelId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("Level completed! 🎉");
      
      // Wait for 2 seconds before redirecting
      setTimeout(() => {
        navigate('/levels');
      }, 2000);
    } catch (error) {
      console.error("Error completing level:", error);
      toast.error("Failed to save level progress");
      setIsLevelComplete(false); // Reset if there was an error
    }
  };

  

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };
  
    const loadPoseNet = async () => {
      const net = await posenet.load();
      console.log("PoseNet model loaded!");
      
      const detectPose = async () => {
        if (!canvasRef.current || !videoRef.current || isLevelComplete || !levelData) {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          return;
        }
      
        if (videoRef.current.readyState === 4) {
          try {
            const pose = await net.estimateSinglePose(videoRef.current, {
              flipHorizontal: false,
              outputStride: 8,
              imageScaleFactor: 0.75
            });
      
            if (canvasRef.current && !isLevelComplete) {
              console.log("Current levelData:", levelData); // Debug log
              console.log("Level Data exercises:", levelData.exercises); // Debug log
              
              // Only run detection for exercises in the current level
              levelData.exercises.forEach(exercise => {
                console.log("Checking exercise:", exercise.name); // Debug log
                
                switch(exercise.name) {
                  case 'BicepCurl':
                    console.log("Calling detectBicepCurl"); // Debug log
                    detectBicepCurl(pose);
                    break;
                  case 'Pushups':
                    console.log("Detecting pushups...");
                    detectPushups(pose); 
                    break; 
                  case 'Planks':
                    detectPlank(pose);
                    break;
                  case 'JumpingJack':
                    detectJumpingJacks(pose);
                    break;
                  
                  case 'Squats':
                    detectSquats(pose);
                    break;
                  default:
                    console.log("Unknown exercise:", exercise.name);  
                  // ... other cases ...
                }
              });
              
              drawPose(pose);
            }
          } catch (error) {
            console.error('Error detecting pose:', error);
          }
        }
      
        if (!isLevelComplete) {
          animationFrameRef.current = requestAnimationFrame(detectPose);
        }
      };
    
      detectPose();
    };
  
    // Only start PoseNet after levelData is loaded
    if (levelData) {
      setupCamera().then(loadPoseNet);
    }
  
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        
      }
      
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      if (plankInterval.current) {
        clearInterval(plankInterval.current);
      }
    };
  }, [levelData,isLevelComplete]); // Add levelData as a dependency
  

  const getAngle = (A, B, C) => {
    let angle = (Math.atan2(C.y - B.y, C.x - B.x) - Math.atan2(A.y - B.y, A.x - B.x)) * (180 / Math.PI);
    return Math.abs(angle);
  };

  // const detectPushups = (pose) => {
  //   console.log("Inside detectPushups function");
  
  //   // Check for exact exercise name match
  //   const pushupExercise = levelData?.exercises.find(ex => ex.name === 'Pushups');
  //   if (!pushupExercise) {
  //     console.log("Pushups exercise not found in level data");
  //     return;
  //   }
  //   console.log("Found Pushups exercise with target reps:", pushupExercise.reps);
  
  //   const keypoints = pose.keypoints;
  //   const leftShoulder = keypoints[5];
  //   const leftElbow = keypoints[7];
  //   const leftWrist = keypoints[9];
  //   const rightShoulder = keypoints[6];
  //   const rightElbow = keypoints[8];
  //   const rightWrist = keypoints[10];
  
  //   // Lower confidence threshold for better detection
  //   const confidenceThreshold = 0.5;
  
  //   if ([leftShoulder, leftElbow, leftWrist, rightShoulder, rightElbow, rightWrist]
  //       .some(point => point.score < confidenceThreshold)) {
  //     console.log("Keypoint scores:", {
  //       leftShoulder: leftShoulder.score,
  //       leftElbow: leftElbow.score,
  //       leftWrist: leftWrist.score,
  //       rightShoulder: rightShoulder.score,
  //       rightElbow: rightElbow.score,
  //       rightWrist: rightWrist.score
  //     });
  //     return;
  //   }
  
  //   const leftArmAngle = getAngle(leftShoulder.position, leftElbow.position, leftWrist.position);
  //   const rightArmAngle = getAngle(rightShoulder.position, rightElbow.position, rightWrist.position);
    
  //   console.log("Left arm angle:", leftArmAngle, "Right arm angle:", rightArmAngle);
  
  //   // Adjusted thresholds for proper wall pushup form
  //   const bentArmThreshold = 50;    // More bent arm position
  //   const straightArmThreshold = 150; // More extended arm position
  
  //   // Both arms must be bent/straight for a proper pushup
  //   const armsAreBent = leftArmAngle < bentArmThreshold && rightArmAngle < bentArmThreshold;
  //   const armsAreStraight = leftArmAngle > straightArmThreshold && rightArmAngle > straightArmThreshold;
  
  //   // Debug logging
  //   if (armsAreBent) {
  //     console.log("Both arms are bent - Left:", leftArmAngle, "Right:", rightArmAngle);
  //   }
  //   if (armsAreStraight) {
  //     console.log("Both arms are straight - Left:", leftArmAngle, "Right:", rightArmAngle);
  //   }
  
  //   if (armsAreBent && !isPushingUp.current) {
  //     console.log("Starting pushup - both arms properly bent");
  //     isPushingUp.current = true;
  //   }
  //   else if (armsAreStraight && isPushingUp.current) {
  //     const newCount = pushupCount + 1;
  //     console.log("Completing pushup - both arms properly extended, new count:", newCount);
  //     setPushupCount(newCount);
  //     updateExerciseProgress('Pushups', newCount);
      
  //     // Log progress update
  //     console.log("Current progress:", exerciseProgress);
  //     console.log("Target reps:", pushupExercise.reps);
      
  //     isPushingUp.current = false;
  
  //     // Emit socket event for exercise update
  //     if (socket) {
  //       socket.emit('exercise_update', {
  //         userId: user.id,
  //         userName: user.name,
  //         exercise: 'Pushups',
  //         progress: newCount
  //       });
  //     }
  //   }
  // };
  

  const detectPushups = (pose) => {
    console.log("Inside detectPushups function");

    // Check if Pushups exist in levelData
    const pushupExercise = levelData?.exercises.find(ex => ex.name === 'Pushups');
    if (!pushupExercise) {
        console.log("Pushups exercise not found in level data");
        return;
    }
    console.log("Found Pushups exercise with target reps:", pushupExercise.reps);

    const keypoints = pose.keypoints;
    const leftShoulder = keypoints[5];
    const leftElbow = keypoints[7];
    const leftWrist = keypoints[9];
    const rightShoulder = keypoints[6];
    const rightElbow = keypoints[8];
    const rightWrist = keypoints[10];

    // Confidence threshold for keypoints
    const confidenceThreshold = 0.3;
    if ([leftShoulder, leftElbow, leftWrist, rightShoulder, rightElbow, rightWrist]
        .some(point => point.score < confidenceThreshold)) {
        console.log("Low confidence in keypoints. Skipping frame.");
        return;
    }

    // Calculate arm angles
    const leftArmAngle = getAngle(leftShoulder.position, leftElbow.position, leftWrist.position);
    const rightArmAngle = getAngle(rightShoulder.position, rightElbow.position, rightWrist.position);
    
    console.log("Left arm angle:", leftArmAngle, "Right arm angle:", rightArmAngle);

    // Pushup form detection thresholds
    const bentArmThreshold = 50;      // Arms fully bent
    const straightArmThreshold = 150; // Arms fully extended

    const armsAreBent = leftArmAngle < bentArmThreshold && rightArmAngle < bentArmThreshold;
    const armsAreStraight = leftArmAngle > straightArmThreshold && rightArmAngle > straightArmThreshold;

    // Debug logs
    if (armsAreBent) console.log("Both arms are bent - pushup going down");
    if (armsAreStraight) console.log("Both arms are straight - pushup going up");

    if (armsAreBent && !isPushingUp.current) {
        console.log("Starting pushup - Bent position detected");
        isPushingUp.current = true;
    } 
    else if (armsAreStraight && isPushingUp.current) {
        console.log("Completing pushup - Straight position detected");

        setPushupCount(prevCount => {
            const newCount = prevCount + 1;
            console.log("Updated Pushup Count:", newCount);

            updateExerciseProgress('Pushups', newCount);

            // Emit socket event
            if (socket) {
                socket.emit('exercise_update', {
                    userId: user.id,
                    userName: user.name,
                    exercise: 'Pushups',
                    progress: newCount
                });
            }

            return newCount; // Ensure state updates correctly
        });

        isPushingUp.current = false;
    }
};

const detectPlank = (pose) => {
  console.log("Inside detectPlank function");

  // Check if Planks exist in levelData
  if (!levelData?.exercises.some(ex => ex.name === 'Planks')) {
      console.log("Plank exercise not found in level data");
      return;
  }

  // Ensure pose is valid
  if (!pose || !pose.keypoints) {
      console.log("Invalid pose data");
      return;
  }

  const keypoints = pose.keypoints;
  const shoulders = [keypoints[5], keypoints[6]];
  const hips = [keypoints[11], keypoints[12]];
  const ankles = [keypoints[15], keypoints[16]];

  // Ensure keypoints have a good confidence score
  if ([...shoulders, ...hips, ...ankles].some(point => point.score < 0.5)) {
      console.log("Low confidence in keypoints, skipping detection");
      return;
  }

  // Check if shoulders and hips are level (not tilted)
  const isAligned =
      Math.abs(shoulders[0].position.y - shoulders[1].position.y) < 20 &&
      Math.abs(hips[0].position.y - hips[1].position.y) < 20;

  // Check body angle (should be near 180° for a proper plank)
  const bodyAngle = getAngle(
      shoulders[0].position,
      hips[0].position,
      ankles[0].position
  );

  console.log(`Body Angle: ${bodyAngle}, IsAligned: ${isAligned}`);

  if (isAligned && Math.abs(bodyAngle - 180) < 30) {
      if (!isInPlank.current) {
          console.log("Plank started");
          isInPlank.current = true;
          plankStartTime.current = Date.now();

          plankInterval.current = setInterval(() => {
              const duration = Math.floor((Date.now() - plankStartTime.current) / 1000);
              setPlankTimer(duration);
              console.log(`Plank Time: ${duration} sec`);

              updateExerciseProgress('Planks', duration);

              // Emit WebSocket event
              if (socket) {
                  socket.emit('exercise_update', {
                      userId: user.id,
                      userName: user.name,
                      exercise: 'Planks',
                      progress: duration
                  });
              }
          }, 1000);
      }
  } else {
      if (isInPlank.current) {
          console.log("Plank ended");
          isInPlank.current = false;

          if (plankInterval.current) {
              clearInterval(plankInterval.current);
              plankInterval.current = null;
          }
      }
  }
};


  // const detectPlank = (pose) => {
  //   if (!levelData?.exercises.some(ex => ex.name.toLowerCase() === 'Planks')) return;
  
  //   const keypoints = pose.keypoints;
  //   const shoulders = [keypoints[5], keypoints[6]];
  //   const hips = [keypoints[11], keypoints[12]];
  //   const ankles = [keypoints[15], keypoints[16]];
  
  //   if ([...shoulders, ...hips, ...ankles].some(point => point.score < 0.5)) return;
  
  //   const isAligned = Math.abs(shoulders[0].position.y - shoulders[1].position.y) < 20 &&
  //                     Math.abs(hips[0].position.y - hips[1].position.y) < 20;
    
  //   const bodyAngle = getAngle(
  //     shoulders[0].position,
  //     hips[0].position,
  //     ankles[0].position
  //   );
  
  //   if (isAligned && Math.abs(bodyAngle - 180) < 30) {
  //     if (!isInPlank.current) {
  //       isInPlank.current = true;
  //       plankStartTime.current = Date.now();
  //       plankInterval.current = setInterval(() => {
  //         const duration = Math.floor((Date.now() - plankStartTime.current) / 1000);
  //         setPlankTimer(duration);
  //         updateExerciseProgress('plank', duration);
  //       }, 1000);
  //     }
  //   } else {
  //     if (isInPlank.current) {
  //       isInPlank.current = false;
  //       if (plankInterval.current) {
  //         clearInterval(plankInterval.current);
  //       }
  //     }
  //   }
  // };

 
  const detectBicepCurl = (pose) => {
    if (!levelData?.exercises.some(ex => ex.name === 'BicepCurl')) return;
  
    const keypoints = pose.keypoints;
    const leftShoulder = keypoints[5];
    const leftElbow = keypoints[7];
    const leftWrist = keypoints[9];
    const rightShoulder = keypoints[6];
    const rightElbow = keypoints[8];
    const rightWrist = keypoints[10];
  
    // Ensure all keypoints are detected with sufficient confidence
    if ([leftShoulder, leftElbow, leftWrist, rightShoulder, rightElbow, rightWrist]
        .every(point => point.score > 0.5)) {  // Lowered threshold slightly
  
      const leftArmAngle = getAngle(leftShoulder.position, leftElbow.position, leftWrist.position);
      const rightArmAngle = getAngle(rightShoulder.position, rightElbow.position, rightWrist.position);
  
      console.log(`Left Arm Angle: ${leftArmAngle}, Right Arm Angle: ${rightArmAngle}`);
  
      // Track the highest count between left and right arms
      const currentMax = Math.max(leftCurlCount, rightCurlCount);
  
      // Left arm curl detection
      if (leftArmAngle < 60 && !isLeftCurlUp.current) {
        console.log('Left arm curl UP detected!');
        isLeftCurlUp.current = true;
      } 
      else if (leftArmAngle > 160 && isLeftCurlUp.current) {
        console.log('Left arm curl DOWN detected, increasing count.');
        setLeftCurlCount(prevCount => {
          const newCount = prevCount + 1;
          console.log(`Updated Left Curl Count: ${newCount}`);
          if (newCount > currentMax) {
            updateExerciseProgress('BicepCurl', newCount);
          }
          return newCount;
        });
        isLeftCurlUp.current = false;  // Reset for next rep
      }
  
      // Right arm curl detection
      if (rightArmAngle < 60 && !isRightCurlUp.current) {
        console.log('Right arm curl UP detected!');
        isRightCurlUp.current = true;
      }
      else if (rightArmAngle > 160 && isRightCurlUp.current) {
        console.log('Right arm curl DOWN detected, increasing count.');
        setRightCurlCount(prevCount => {
          const newCount = prevCount + 1;
          console.log(`Updated Right Curl Count: ${newCount}`);
          if (newCount > currentMax) {
            updateExerciseProgress('BicepCurl', newCount);
          }
          return newCount;
        });
        isRightCurlUp.current = false;  // Reset for next rep
      }
  
      // Log the current state of curl detection
      console.log(`isLeftCurlUp: ${isLeftCurlUp.current}, isRightCurlUp: ${isRightCurlUp.current}`);
    }
  };
  
  const detectJumpingJacks = (pose) => {
    console.log("Inside detectJumpingJacks function");

    // Check if Jumping Jack exercise exists in levelData
    const jumpingJackExercise = levelData?.exercises.find(ex => ex.name === 'JumpingJack');
    if (!jumpingJackExercise) {
        console.log("Jumping Jack exercise not found in level data");
        return;
    }
    console.log("Found Jumping Jack exercise with target reps:", jumpingJackExercise.reps);

    // Ensure pose is valid
    if (!pose || !pose.keypoints) {
        console.log("Invalid pose data");
        return;
    }

    // Detect arm and leg movements
    detectArmMovement(pose);
    detectLegMovement(pose);

    // Check if both arm and leg movements complete a rep
    if (legRepDone.current && armRepDone.current) {
        setJumpingJackCount(prevCount => {
            const newCount = prevCount + 1;
            console.log("Updated Jumping Jack Count:", newCount);

            updateExerciseProgress('JumpingJack', newCount);

            // Emit socket event
            if (socket) {
                socket.emit('exercise_update', {
                    userId: user.id,
                    userName: user.name,
                    exercise: 'JumpingJack',
                    progress: newCount
                });
            }

            legRepDone.current = false; 
            armRepDone.current = false;

            return newCount;  // Ensure state updates correctly
        });
    }
};

 
  // const detectBicepCurl = (pose) => {
  //   if (!levelData?.exercises.some(ex => ex.name === 'BicepCurl')) return;
  
  //   const keypoints = pose.keypoints;
  //   const leftShoulder = keypoints[5];
  //   const leftElbow = keypoints[7];
  //   const leftWrist = keypoints[9];
  //   const rightShoulder = keypoints[6];
  //   const rightElbow = keypoints[8];
  //   const rightWrist = keypoints[10];
  
  //   if ([leftShoulder, leftElbow, leftWrist, rightShoulder, rightElbow, rightWrist]
  //       .every(point => point.score > 0.5)) {
  //     const leftArmAngle = getAngle(leftShoulder.position, leftElbow.position, leftWrist.position);
  //     const rightArmAngle = getAngle(rightShoulder.position, rightElbow.position, rightWrist.position);
      
  //     // Track the highest count between left and right arms
  //     const currentMax = Math.max(leftCurlCount, rightCurlCount);
      
  //     // Left arm curl
  //     if (leftArmAngle < 60 && !isLeftCurlUp.current) {
  //       isLeftCurlUp.current = true;
  //     } 
  //     else if (leftArmAngle > 160 && isLeftCurlUp.current) {
  //       const newCount = leftCurlCount + 1;
  //       setLeftCurlCount(newCount);
  //       if (newCount > currentMax) {
  //         updateExerciseProgress('BicepCurl', newCount);
  //       }
  //       isLeftCurlUp.current = false;
  //     }
  
  //     // Right arm curl
  //     if (rightArmAngle < 60 && !isRightCurlUp.current) {
  //       isRightCurlUp.current = true;
  //     }
  //     else if (rightArmAngle > 160 && isRightCurlUp.current) {
  //       const newCount = rightCurlCount + 1;
  //       setRightCurlCount(newCount);
  //       if (newCount > currentMax) {
  //         updateExerciseProgress('BicepCurl', newCount);
  //       }
  //       isRightCurlUp.current = false;
  //     }
  //   }
  // };
  
  ////////////////////////////////////////////////////////

  const detectArmMovement = (pose) => {
    if (!pose || !pose.keypoints) return;

    const leftWrist = pose.keypoints[9]?.position;
    const rightWrist = pose.keypoints[10]?.position;
    const leftShoulder = pose.keypoints[5]?.position;
    const rightShoulder = pose.keypoints[6]?.position;

    const leftWristScore = pose.keypoints[9]?.score || 0;
    const rightWristScore = pose.keypoints[10]?.score || 0;
    const leftShoulderScore = pose.keypoints[5]?.score || 0;
    const rightShoulderScore = pose.keypoints[6]?.score || 0;

    if (leftWristScore < 0.5 || rightWristScore < 0.5 || leftShoulderScore < 0.5 || rightShoulderScore < 0.5) return;

    const armsRaised = leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y;

    if (armsRaised && !isArmsUp.current) {
      isArmsUp.current = true;
    }
    
    else if (!armsRaised && isArmsUp.current) {
      setArmCount((prev) => prev + 1);
      isArmsUp.current = false;
      armRepDone.current = true; 
      detectJumpingJacks(); 
    }
  };
  ///////////////////////////////////////////////////////
  const detectLegMovement = (pose) => {
    if (!pose || !pose.keypoints) return;
  
    const leftAnkle = pose.keypoints[15]?.position;
    const rightAnkle = pose.keypoints[16]?.position;
  
    const leftAnkleScore = pose.keypoints[15]?.score || 0;
    const rightAnkleScore = pose.keypoints[16]?.score || 0;
  
    if (leftAnkleScore < 0.5 || rightAnkleScore < 0.5) return;
  
    const footDistance = Math.abs(leftAnkle.x - rightAnkle.x);

    const legCloseThreshold = 40; 
    const legOpenThreshold = 80;  
  
    if (footDistance > legOpenThreshold && !isLegsApart.current) {
      isLegsApart.current = true; 
    }
  
    else if (footDistance < legCloseThreshold && isLegsApart.current) {
      setLegCount((prev) => prev + 1); 
      isLegsApart.current = false; 
      legRepDone.current = true; 
      detectJumpingJacks(); 
    }
  };
  
  ///////////////////////////////////////////////////
  const detectLeftSquat = (pose) => {
    const keypoints = pose.keypoints;
  
    const leftHip = keypoints[11];
    const leftKnee = keypoints[13];
    const leftAnkle = keypoints[15];
  
    if (leftHip.score < 0.5 || leftKnee.score < 0.5 || leftAnkle.score < 0.5) {
      return false;
    }
  
    const leftKneeAngle = getAngle(leftHip.position, leftKnee.position, leftAnkle.position);
  
    return leftKneeAngle < 90; 
  };
  ///////////////////////////////////////////////////
  const detectRightSquat = (pose) => {
    const keypoints = pose.keypoints;
  
    const rightHip = keypoints[12];
    const rightKnee = keypoints[14];
    const rightAnkle = keypoints[16];
  
    if (rightHip.score < 0.5 || rightKnee.score < 0.5 || rightAnkle.score < 0.5) {
      return false;
    }
  
    const rightKneeAngle = getAngle(rightHip.position, rightKnee.position, rightAnkle.position);
  
    return rightKneeAngle < 90; 3
  };
  //////////////////////////////////////////////////
    const detectSquats = (pose) => {
    console.log("Inside detectSquats function");

    // Ensure pose is valid
    if (!pose || !pose.keypoints) {
        console.log("Invalid pose data");
        return;
    }
    if (!levelData?.exercises.some(ex => ex.name === 'Squats')) return;
    // Detect squat positions using helper functions
    const isLeftSquatting = detectLeftSquat(pose);
    const isRightSquatting = detectRightSquat(pose);

    // If either or both legs are in squat position, mark as squatting
    if ((isLeftSquatting || isRightSquatting) && !isSquatting.current) {
        console.log("Entering squat position");
        isSquatting.current = true;
    }

    // Calculate knee angles
    const leftKneeAngle = getAngle(
        pose.keypoints[11].position,
        pose.keypoints[13].position,
        pose.keypoints[15].position
    );
    const rightKneeAngle = getAngle(
        pose.keypoints[12].position,
        pose.keypoints[14].position,
        pose.keypoints[16].position
    );

    console.log(`Left Knee Angle: ${leftKneeAngle}, Right Knee Angle: ${rightKneeAngle}`);

    // If knees are fully extended after a squat, count it as a rep
    if (leftKneeAngle > 160 && rightKneeAngle > 160 && isSquatting.current) {
        setSquatCount(prevCount => {
            const newCount = prevCount + 1;
            console.log(`✅ Squat Count Updated: ${newCount}`);

            updateExerciseProgress('Squats', newCount);

            // Emit socket event
            if (socket) {
                socket.emit('exercise_update', {
                    userId: user.id,
                    userName: user.name,
                    exercise: 'Squats',
                    progress: newCount
                });
            }

            return newCount;  // Ensure correct state update
        });

        isSquatting.current = false; // Reset for the next squat rep
    }
};

  ///////////////////////////////////////////
  
  const drawPose = (pose) => {
    // Add safety check at the start of the function
    if (!canvasRef.current || isLevelComplete) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }
  
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  
    pose.keypoints.forEach((point) => {
      if (point.score > 0.5) {
        ctx.beginPath();
        ctx.arc(point.position.x, point.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      }
    });
  
    drawSkeleton(pose, ctx);
  };
 //////////////////////////////////////////////
  
  const drawSkeleton = (pose, ctx) => {
    // Add safety check for ctx
    if (!ctx || !canvasRef.current) return;
  
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(pose.keypoints, 0.5);
    adjacentKeyPoints.forEach(([partA, partB]) => {
      ctx.beginPath();
      ctx.moveTo(partA.position.x, partA.position.y);
      ctx.lineTo(partB.position.x, partB.position.y);
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  };

  const BicepCurl = (leftCurlCount >= rightCurlCount )? leftCurlCount : rightCurlCount;
  const Plank = plankTimer;
  const Pushups = pushupCount;
  const JumpingJack = jumpingJackCount;
  const Squats = squatCount;
  const plank_count = 0;
  const plank_duration = plankTimer;


  return (
    <div className="min-h-screen bg-gray-900 py-8">
    <div className="container mx-auto px-4">
      {levelData ? (
        <>
          {/* Level Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              Level {levelData.levelNumber}
            </h1>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-lg shadow-lg">
              <p className="text-xl text-white mb-2">{levelData.aim}</p>
              <div className="flex items-center justify-center space-x-4">
                <span className="px-3 py-1 bg-gray-800 rounded-full text-sm text-white">
                  Difficulty: {levelData.difficulty}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Video Feed Container - Keeping original dimensions */}
            <div className="relative bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="relative" style={{ width: '640px', height: '480px' }}>
                <video
                  ref={videoRef}
                  width="640"
                  height="480"
                  autoPlay
                  playsInline
                  className="absolute top-0 left-0"
                />
                <canvas
                  ref={canvasRef}
                  width="640"
                  height="480"
                  className="absolute top-0 left-0"
                />
              </div>
              
              {/* Camera Overlay UI */}
              <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-white text-sm">Live Camera</span>
                </div>
              </div>
            </div>

            {/* Exercise Progress Panel */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Exercise Progress
              </h2>
              
              <div className="space-y-4">
                {Object.entries(exerciseProgress).map(([exercise, { current, target, type }]) => (
                  <div key={exercise} className="bg-gray-700 rounded-lg p-4 transition-all duration-300 hover:bg-gray-600">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-medium text-white capitalize">
                        {exercise.replace('_', ' ')}
                      </span>
                      <span className="text-sm bg-gray-900 px-3 py-1 rounded-full text-blue-400">
                        {current} / {target} {type === 'duration' ? 'sec' : 'reps'}
                      </span>
                    </div>
                    <div className="relative w-full h-3 bg-gray-900 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-out"
                        style={{
                          width: `${Math.min((current / target) * 100, 100)}%`,
                          background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 100%)'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        // Loading State
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl text-gray-300">Loading your workout...</p>
        </div>
      )}

      {/* Level Complete Modal */}
      {isLevelComplete && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 transform animate-bounce-in">
            <div className="text-center">
              <div className="inline-block p-4 bg-blue-500/20 rounded-full mb-4">
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Level Complete! 🎉</h2>
              <p className="text-gray-300 mb-6">Amazing work! Get ready for the next challenge...</p>
              <div className="animate-pulse">
                <span className="inline-block px-4 py-2 bg-blue-500/20 rounded-full text-blue-400">
                  Redirecting...
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default ExerciseDetector;



