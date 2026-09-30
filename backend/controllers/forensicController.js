const ForensicData = require("../models/recordsModel");

exports.addForensicData = async (req, res) => {
  const { name, age, gender, province } = req.body;
  const photo = req.files?.photo?.[0]?.path || null;
  const radiograph = req.files?.radiograph?.[0]?.path || null;

  // Validate required fields
  if (!name || !age || !gender || !province || !photo || !radiograph) {
    return res
      .status(400)
      .json({
        message: "All fields, including photo and radiograph, are required.",
      });
  }

  try {
    // Create a new forensic entry without the createdBy field
    const newForensicData = new ForensicData({
      name,
      age,
      gender,
      province,
      photo,
      radiograph,
    });

    await newForensicData.save();
    res
      .status(201)
      .json({
        message: "Forensic data added successfully",
        data: newForensicData,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding forensic data", error: error.message });
  }
};
