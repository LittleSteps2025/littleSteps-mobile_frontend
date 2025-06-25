import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft, Filter, ChevronDown } from "lucide-react-native";

const childrenData = [
  {
    id: 1,
    name: "Emma Johnson",
    age: 8,
    gender: "girl",
    profileImage:
      "https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg",
    grade: "3rd Grade",
    school: "Sunshine Elementary",
    group: "sunshine",
    package: "weekdays",
    presentToday: true,
  },
  {
    id: 2,
    name: "Lucas Martinez",
    age: 10,
    gender: "boy",
    profileImage:
      "https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg",
    grade: "5th Grade",
    school: "Riverside Elementary",
    group: "mood",
    package: "weekend",
    presentToday: false,
  },
  {
    id: 3,
    name: "Sophia Chen",
    age: 6,
    gender: "girl",
    profileImage:
      "https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg",
    grade: "1st Grade",
    school: "Meadowbrook Elementary",
    group: "diamond",
    package: "weekdays",
    presentToday: true,
  },
];

const packageOptions = [
  { label: "All Packages", value: "all" },
  { label: "Weekdays Only", value: "weekdays" },
  { label: "Weekend Only", value: "weekend" }
];

const groupOptions = [
  { label: "All Groups", value: "all" },
  { label: "Sunshine", value: "sunshine" },
  { label: "Mood", value: "mood" },
  { label: "Diamond", value: "diamond" }
];

type Option = {
  label: string;
  value: string;
};

interface CustomDropdownProps {
  label: string;
  options: Option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  options,
  selectedValue,
  onValueChange,
  modalVisible,
  setModalVisible
}) => {
  const getSelectedLabel = (options: Option[], value: string): string => {
    return options.find(option => option.value === value)?.label || "Select";
  };


  return (
    <View style={styles.filterItem}>
      <Text style={styles.filterLabel}>{label}</Text>
      <TouchableOpacity 
        style={styles.customDropdown}
onPress={() => setModalVisible(!modalVisible)}
        activeOpacity={0.8}
      >
        <Text style={styles.dropdownText} numberOfLines={1}>
          {getSelectedLabel(options, selectedValue)}
        </Text>
        <ChevronDown size={20} color="#FFFFFF" />
      </TouchableOpacity>
      
     {modalVisible && (
  <View style={styles.dropdownPopover}>
    <ScrollView style={styles.optionsList}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.optionItem,
            selectedValue === option.value && styles.selectedOption,
          ]}
          onPress={() => {
            onValueChange(option.value);
            setModalVisible(false);
          }}
        >
          <Text
            style={[
              styles.optionText,
              selectedValue === option.value && styles.selectedOptionText,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
)}

    </View>
  );
};

export default function ChildProfiles() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [packageModalVisible, setPackageModalVisible] = useState(false);
  const [groupModalVisible, setGroupModalVisible] = useState(false);

  const getGenderColors = (gender:String) => {
    return gender === "girl"
      ? { primary: "#ec4899", secondary: "#fce7f3", accent: "#be185d" }
      : { primary: "#3b82f6", secondary: "#dbeafe", accent: "#1d4ed8" };
  };

  const handleChildPress = () => {
    router.push("/teacher/child-page");
  };

  const filteredChildren = childrenData.filter((child) => {
    const packageMatch =
      selectedPackage === "all" || child.package === selectedPackage;
    const groupMatch = selectedGroup === "all" || child.group === selectedGroup;
    const todayMatch = !showTodayOnly || child.presentToday;
    return packageMatch && groupMatch && todayMatch;
  });

  const resetFilters = () => {
    setSelectedPackage("all");
    setSelectedGroup("all");
    setShowTodayOnly(false);
  };

  const hasActiveFilters = selectedPackage !== "all" || selectedGroup !== "all" || showTodayOnly;

  return (
    <LinearGradient
      colors={[
        "#DFC1FD",
        "#f3e8ff",
        "#F5ECFE",
        "#F5ECFE",
        "#e9d5ff",
        "#DFC1FD",
      ]}
      style={styles.container}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.title}>All Children</Text>
          <View style={styles.headerRight}>
            <Text style={styles.resultCount}>
              {filteredChildren.length} children
            </Text>
          </View>
        </View>

        {/* Filter Section */}
        <View style={{ position: 'relative', zIndex: 999 }}>
        <View style={styles.filterContainer}>
          <View style={styles.filterHeader}>
            <View style={styles.filterTitleContainer}>
              <Filter size={20} color="#8B5CF6" />
              <Text style={styles.filterTitle}>Filters</Text>
            </View>
            {hasActiveFilters && (
              <TouchableOpacity onPress={resetFilters} style={styles.resetButton}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.filtersRow}>
            {/* Package Filter */}
            <CustomDropdown
              label="Package"
              options={packageOptions}
              selectedValue={selectedPackage}
              onValueChange={setSelectedPackage}
              modalVisible={packageModalVisible}
              setModalVisible={setPackageModalVisible}
            />

            {/* Group Filter */}
            <CustomDropdown
              label="Group"
              options={groupOptions}
              selectedValue={selectedGroup}
              onValueChange={setSelectedGroup}
              modalVisible={groupModalVisible}
              setModalVisible={setGroupModalVisible}
            />
          </View>

          {/* Today Only Toggle */}
          <TouchableOpacity
            style={[
              styles.toggleButton,
              showTodayOnly ? styles.toggleButtonActive : styles.toggleButtonInactive
            ]}
            onPress={() => setShowTodayOnly((prev) => !prev)}
            activeOpacity={0.8}
          >
            <View style={styles.toggleContent}>
              <Text
                style={[
                  styles.toggleButtonText,
                  showTodayOnly ? styles.toggleButtonTextActive : styles.toggleButtonTextInactive
                ]}
              >
                Present Today Only
              </Text>
              <View style={[
                styles.toggleIndicator,
                showTodayOnly ? styles.toggleIndicatorActive : styles.toggleIndicatorInactive
              ]}>
                <View style={[
                  styles.toggleCircle,
                  showTodayOnly ? styles.toggleCircleActive : styles.toggleCircleInactive
                ]} />
              </View>
            </View>
          </TouchableOpacity>
        </View></View>

        {/* Children List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredChildren.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No children match your filters</Text>
              <TouchableOpacity onPress={resetFilters} style={styles.emptyStateButton}>
                <Text style={styles.emptyStateButtonText}>Clear Filters</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredChildren.map((child) => {
              const colors = getGenderColors(child.gender);
              return (
                <TouchableOpacity
                  key={child.id}
                  style={styles.childCard}
                  onPress={handleChildPress}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardContent}>
                    <View
                      style={[
                        styles.imageContainer,
                        { borderColor: colors.primary },
                      ]}
                    >
                      <Image
                        source={{ uri: child.profileImage }}
                        style={styles.profileImage}
                      />
                      <View
                        style={[
                          styles.genderIndicator,
                          { backgroundColor: colors.primary },
                        ]}
                      >
                        <Text style={styles.genderText}>
                          {child.gender === "girl" ? "♀" : "♂"}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.childInfo}>
                      <View style={styles.childNameRow}>
                        <Text style={styles.childName}>{child.name}</Text>
                        {child.presentToday && (
                          <View style={styles.presentBadge}>
                            <Text style={styles.presentBadgeText}>Present</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.childAge}>Age {child.age}</Text>
                      <View style={styles.tagsContainer}>
                        <View
                          style={[
                            styles.gradeTag,
                            { backgroundColor: colors.secondary },
                          ]}
                        >
                          <Text
                            style={[styles.gradeText, { color: colors.accent }]}
                          >
                            {child.grade}
                          </Text>
                        </View>
                        <View style={styles.groupTag}>
                          <Text style={styles.groupText}>{child.group}</Text>
                        </View>
                      </View>
                      <Text style={styles.schoolName}>{child.school}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.bottomBorder,
                      { backgroundColor: colors.primary },
                    ]}
                  />
                </TouchableOpacity>
              );
            })
          )}




          
        </ScrollView>

        

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, marginTop: 28 },
  
  // Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#374151",
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    width: 40,
    alignItems: "flex-end",
  },
  resultCount: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },

  // Filter Styles
  filterContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  filterTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 8,
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#8B5CF6",
  },
  resetButtonText: {
    color: "#8B5CF6",
    fontSize: 14,
    fontWeight: "500",
  },
  filtersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  filterItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  customDropdown: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  modalCloseButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#8B5CF6",
    borderRadius: 8,
  },
  modalCloseText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  optionsList: {
    paddingHorizontal: 20,
  },
  optionItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  selectedOption: {
    backgroundColor: "#F3F4F6",
  },
  optionText: {
    fontSize: 16,
    color: "#374151",
  },
  selectedOptionText: {
    color: "#8B5CF6",
    fontWeight: "600",
  },
  toggleButton: {
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  toggleButtonActive: {
    backgroundColor: "#F3F4F6",
    borderWidth: 2,
    borderColor: "#8B5CF6",
  },
  toggleButtonInactive: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  toggleContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  toggleButtonTextActive: {
    color: "#374151",
  },
  toggleButtonTextInactive: {
    color: "#6B7280",
  },
  toggleIndicator: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: "center",
  },
  toggleIndicatorActive: {
    backgroundColor: "#8B5CF6",
    alignItems: "flex-end",
  },
  toggleIndicatorInactive: {
    backgroundColor: "#D1D5DB",
    alignItems: "flex-start",
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  toggleCircleActive: {
    backgroundColor: "#FFFFFF",
  },
  toggleCircleInactive: {
    backgroundColor: "#FFFFFF",
  },

  // List Styles
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  // Card Styles
  childCard: {
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: "hidden",
  },
  cardContent: { flexDirection: "row", padding: 20, alignItems: "center" },
  imageContainer: {
    position: "relative",
    borderWidth: 3,
    borderRadius: 35,
    padding: 3,
  },
  profileImage: { width: 60, height: 60, borderRadius: 30 },
  genderIndicator: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  genderText: { color: "white", fontSize: 12, fontWeight: "bold" },
  childInfo: { flex: 1, marginLeft: 16 },
  childNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  childName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
  },
  presentBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  presentBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  childAge: { fontSize: 14, color: "#6b7280", marginBottom: 8 },
  tagsContainer: {
    flexDirection: "row",
    marginBottom: 4,
  },
  gradeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
dropdownPopover: {
  position: 'absolute',
  top: 60, // adjust if needed
  left: 0,
  right: 0,
  backgroundColor: '#fff',
  borderRadius: 12,
  paddingVertical: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 20, // increase for Android
  zIndex: 9999,  // ensure it’s above all content
},


  gradeText: { fontSize: 12, fontWeight: "600" },
  groupTag: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  groupText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    textTransform: "capitalize",
  },
  schoolName: { fontSize: 12, color: "#9ca3af" },
  bottomBorder: { height: 4, width: "100%" },
});