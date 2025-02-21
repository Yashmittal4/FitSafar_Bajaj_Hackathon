import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Key,
  Edit2,
  Save,
  X,
  Calendar,
  Activity,
  Weight,
  Ruler,
  Heart,
  Target,
  Clock,
  Shield,
  Dumbbell
} from "lucide-react";

const Myself = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    age: user?.age || "",
    height: user?.height || "",
    weight: user?.weight || "",
    gender: user?.gender || "",
    activityLevel: user?.activityLevel || "",
    fitnessGoal: user?.fitnessGoal || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        age: user.age || "",
        height: user.height || "",
        weight: user.weight || "",
        gender: user.gender || "",
        activityLevel: user.activityLevel || "",
        fitnessGoal: user.fitnessGoal || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error("New passwords don't match");
          return;
        }
        if (!formData.currentPassword) {
          toast.error("Current password is required to set a new password");
          return;
        }
      }

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        {
          name: formData.name,
          email: formData.email,
          age: formData.age,
          height: formData.height,
          weight: formData.weight,
          gender: formData.gender,
          activityLevel: formData.activityLevel,
          fitnessGoal: formData.fitnessGoal,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUser(response.data.user);
      toast.success("Profile updated successfully");
      setIsEditing(false);
      
      // Clear sensitive data
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getActivityLevelText = (level) => {
    const levels = {
      sedentary: "Sedentary (little or no exercise)",
      light: "Lightly active (light exercise/sports 1-3 days/week)",
      moderate: "Moderately active (moderate exercise/sports 3-5 days/week)",
      active: "Very active (hard exercise/sports 6-7 days/week)",
      extraActive: "Extra active (very hard exercise & physical job or training twice per day)"
    };
    return levels[level] || level;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        {/* Profile Stats Card */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl p-6 backdrop-blur-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <User className="text-white" size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                <p className="text-gray-400">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Calendar className="text-blue-400" size={24} />
                  <span className="text-white">Age</span>
                </div>
                <span className="text-xl font-bold text-white">{user?.age} years</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Ruler className="text-green-400" size={24} />
                  <span className="text-white">Height</span>
                </div>
                <span className="text-xl font-bold text-white">{user?.height} cm</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Weight className="text-pink-400" size={24} />
                  <span className="text-white">Weight</span>
                </div>
                <span className="text-xl font-bold text-white">{user?.weight} kg</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Target className="text-yellow-400" size={24} />
                  <span className="text-white">Goal</span>
                </div>
                <span className="text-xl font-bold text-white">{user?.fitnessGoal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl p-6 backdrop-blur-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-xl bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white transition-colors"
            >
              {isEditing ? <X size={24} /> : <Edit2 size={24} />}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-gray-400 mb-2">Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full p-3 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <User className="absolute right-3 top-3 text-gray-400" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full p-3 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <Mail className="absolute right-3 top-3 text-gray-400" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Age</label>
                <div className="relative">
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full p-3 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <Calendar className="absolute right-3 top-3 text-gray-400" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Height (cm)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full p-3 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <Ruler className="absolute right-3 top-3 text-gray-400" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Weight (kg)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full p-3 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <Weight className="absolute right-3 top-3 text-gray-400" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Gender</label>
                <div className="relative">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full p-3 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Activity Level</label>
                <div className="relative">
                  <select
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full p-3 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="">Select Activity Level</option>
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Lightly Active</option>
                    <option value="moderate">Moderately Active</option>
                    <option value="active">Very Active</option>
                    <option value="extraActive">Extra Active</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Fitness Goal</label>
                <div className="relative">
                  <select
                    name="fitnessGoal"
                    value={formData.fitnessGoal}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full p-3 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="">Select Goal</option>
                    <option value="weightLoss">Weight Loss</option>
                    <option value="muscleGain">Muscle Gain</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="generalFitness">General Fitness</option>
                  </select>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="space-y-6 mt-6">
                <div>
                  <label className="block text-gray-400 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Key className="absolute right-3 top-3 text-gray-400" size={20} />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Shield className="absolute right-3 top-3 text-gray-400" size={20} />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Shield className="absolute right-3 top-3 text-gray-400" size={20} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    "Updating..."
                  ) : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Myself;