const Chat = require('../models/Chat');

// Get chat messages for a specific application, receipt, and role
exports.getChats = async (req, res) => {
  const { appId, receiptid, role } = req.query;
  
  // Validate required parameters
  if (!appId || !receiptid || !role) {
    return res.status(400).json({ message: "Missing required query parameters: appId, receiptid, and role" });
  }

  try {
    const chats = await Chat.find({
      appId,
      receiptid,
      $or: [
        { from: "clerk", to: role.toLowerCase().replace(/\s/g, "_") },
        { from: role.toLowerCase().replace(/\s/g, "_"), to: "clerk" }
      ]
    }).sort({ creationTimeStamp: 1 });
    res.status(200).json({ chats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching chats" });
  }
};

exports.getChatsSI = async (req, res) => {
    const { appId, receiptid, role } = req.query;
    
    // Validate required parameters
    if (!appId || !receiptid || !role) {
      return res.status(400).json({ message: "Missing required query parameters: appId, receiptid, and role" });
    }
  
    try {
      const chats = await Chat.find({
        appId,
        receiptid,
        $or: [
          { from: "superintendent", to: role.toLowerCase().replace(/\s/g, "_") },
          { from: role.toLowerCase().replace(/\s/g, "_"), to: "superintendent" }
        ]
      }).sort({ creationTimeStamp: 1 });
      res.status(200).json({ chats });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching chats" });
    }
  };

  exports.getChatsMW = async (req, res) => {
    const { appId, receiptid, role } = req.query;
    
    // Validate required parameters
    if (!appId || !receiptid || !role) {
      return res.status(400).json({ message: "Missing required query parameters: appId, receiptid, and role" });
    }
  
    try {
      const chats = await Chat.find({
        appId,
        receiptid,
        $or: [
          { from: "ministry_welfare", to: role.toLowerCase().replace(/\s/g, "_") },
          { from: role.toLowerCase().replace(/\s/g, "_"), to: "ministry_welfare" }
        ]
      }).sort({ creationTimeStamp: 1 });
      res.status(200).json({ chats });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching chats" });
    }
  };

  exports.getChatsDC = async (req, res) => {
    const { appId, receiptid, role } = req.query;
    
    // Validate required parameters
    if (!appId || !receiptid || !role) {
      return res.status(400).json({ message: "Missing required query parameters: appId, receiptid, and role" });
    }
  
    try {
      const chats = await Chat.find({
        appId,
        receiptid,
        $or: [
          { from: "district_collector", to: role.toLowerCase().replace(/\s/g, "_") },
          { from: role.toLowerCase().replace(/\s/g, "_"), to: "district_collector" }
        ]
      }).sort({ creationTimeStamp: 1 });
      res.status(200).json({ chats });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching chats" });
    }
  };

  exports.getChatsJC = async (req, res) => {
    const { appId, receiptid, role } = req.query;
    
    // Validate required parameters
    if (!appId || !receiptid || !role) {
      return res.status(400).json({ message: "Missing required query parameters: appId, receiptid, and role" });
    }
  
    try {
      const chats = await Chat.find({
        appId,
        receiptid,
        $or: [
          { from: "joint_collector", to: role.toLowerCase().replace(/\s/g, "_") },
          { from: role.toLowerCase().replace(/\s/g, "_"), to: "joint_collector" }
        ]
      }).sort({ creationTimeStamp: 1 });
      res.status(200).json({ chats });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching chats" });
    }
  };

  exports.getChatsRevenueInspector = async (req, res) => {
    const { appId, receiptid, role } = req.query;
    
    // Validate required parameters
    if (!appId || !receiptid || !role) {
      return res.status(400).json({ message: "Missing required query parameters: appId, receiptid, and role" });
    }
  
    try {
      const chats = await Chat.find({
        appId,
        receiptid,
        $or: [
          { from: "revenue_inspector", to: role.toLowerCase().replace(/\s/g, "_") },
          { from: role.toLowerCase().replace(/\s/g, "_"), to: "revenue_inspector" }
        ]
      }).sort({ creationTimeStamp: 1 });
      res.status(200).json({ chats });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching chats" });
    }
  };

  exports.getChatsVRO = async (req, res) => {
    const { appId, receiptid, role } = req.query;
    
    // Validate required parameters
    if (!appId || !receiptid || !role) {
      return res.status(400).json({ message: "Missing required query parameters: appId, receiptid, and role" });
    }
  
    try {
      const chats = await Chat.find({
        appId,
        receiptid,
        $or: [
          { from: "vro", to: role.toLowerCase().replace(/\s/g, "_") },
          { from: role.toLowerCase().replace(/\s/g, "_"), to: "vro" }
        ]
      }).sort({ creationTimeStamp: 1 });
      res.status(200).json({ chats });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching chats" });
    }
  };
  exports.getChatsPO = async (req, res) => {
    const { appId, receiptid, role } = req.query;
    
    // Validate required parameters
    if (!appId || !receiptid || !role) {
      return res.status(400).json({ message: "Missing required query parameters: appId, receiptid, and role" });
    }
  
    try {
      const chats = await Chat.find({
        appId,
        receiptid,
        $or: [
          { from: "project_officer", to: role.toLowerCase().replace(/\s/g, "_") },
          { from: role.toLowerCase().replace(/\s/g, "_"), to: "project_officer" }
        ]
      }).sort({ creationTimeStamp: 1 });
      res.status(200).json({ chats });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching chats" });
    }
  };

  exports.getChatsMRO = async (req, res) => {
    const { appId, receiptid, role } = req.query;
    
    // Validate required parameters
    if (!appId || !receiptid || !role) {
      return res.status(400).json({ message: "Missing required query parameters: appId, receiptid, and role" });
    }
  
    try {
      const chats = await Chat.find({
        appId,
        receiptid,
        $or: [
          { from: "mro", to: role.toLowerCase().replace(/\s/g, "_") },
          { from: role.toLowerCase().replace(/\s/g, "_"), to: "mro" }
        ]
      }).sort({ creationTimeStamp: 1 });
      res.status(200).json({ chats });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching chats" });
    }
  };

  exports.getChatsSurveyor = async (req, res) => {
    const { appId, receiptid, role } = req.query;
    
    // Validate required parameters
    if (!appId || !receiptid || !role) {
      return res.status(400).json({ message: "Missing required query parameters: appId, receiptid, and role" });
    }
  
    try {
      const chats = await Chat.find({
        appId,
        receiptid,
        $or: [
          { from: "surveyor", to: role.toLowerCase().replace(/\s/g, "_") },
          { from: role.toLowerCase().replace(/\s/g, "_"), to: "surveyor" }
        ]
      }).sort({ creationTimeStamp: 1 });
      res.status(200).json({ chats });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching chats" });
    }
  };

  exports.getChatsRDO = async (req, res) => {
    const { appId, receiptid, role } = req.query;
    
    // Validate required parameters
    if (!appId || !receiptid || !role) {
      return res.status(400).json({ message: "Missing required query parameters: appId, receiptid, and role" });
    }
  
    try {
      const chats = await Chat.find({
        appId,
        receiptid,
        $or: [
          { from: "revenue_dept_officer", to: role.toLowerCase().replace(/\s/g, "_") },
          { from: role.toLowerCase().replace(/\s/g, "_"), to: "revenue_dept_officer" }
        ]
      }).sort({ creationTimeStamp: 1 });
      res.status(200).json({ chats });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching chats" });
    }
  };

// Send a new chat message
exports.sendChat = async (req, res) => {
  const { appId, receiptid, from, to, message } = req.body;
  try {
    const chat = new Chat({
      appId,
      receiptid,
      from,
      to,
      message
    });
    await chat.save();
    res.status(201).json({ chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending chat message" });
  }
};

// Get chat applications where clerk is involved
exports.getChatApplications = async (req, res) => {
  try {
    // Find all chat records where clerk is either sender or receiver.
    // Populate the entire ApplicationDetails document with the required fields.
    const chats = await Chat.find({
      $or: [
        { from: "clerk" },
        { to: "clerk" }
      ]
    })
      .sort({ creationTimeStamp: -1 })
      .populate("appId", "compno receiptid surveyNumber ownerName area address state city pincode status documents");

    // Group chats by appId and receiptid combination to get distinct conversations.
    const chatMap = {};
    chats.forEach(chat => {
      // Use the combination of the application id and receiptid as the unique key.
      const key = `${chat.appId._id}-${chat.receiptid}`;
      if (!chatMap[key]) {
        // Use the populated application details
        chatMap[key] = {
          ...chat.appId.toObject(),
          // Ensure receiptid from the chat matches (it should be the same as in ApplicationDetails)
          receiptid: chat.receiptid
        };
      }
    });
    
    const chatApplications = Object.values(chatMap);
    res.status(200).json({ chats: chatApplications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching chat applications" });
  }
};


exports.getChatApplicationsSuperintendent = async (req, res) => {
    try {
      // Find all chat records where clerk is either sender or receiver.
      // Populate the entire ApplicationDetails document with the required fields.
      const chats = await Chat.find({
        $or: [
          { from: "superintendent" },
          { to: "superintendent" }
        ]
      })
        .sort({ creationTimeStamp: -1 })
        .populate("appId", "compno receiptid surveyNumber ownerName area address state city pincode status documents");
  
      // Group chats by appId and receiptid combination to get distinct conversations.
      const chatMap = {};
      chats.forEach(chat => {
        // Use the combination of the application id and receiptid as the unique key.
        const key = `${chat.appId._id}-${chat.receiptid}`;
        if (!chatMap[key]) {
          // Use the populated application details
          chatMap[key] = {
            ...chat.appId.toObject(),
            // Ensure receiptid from the chat matches (it should be the same as in ApplicationDetails)
            receiptid: chat.receiptid
          };
        }
      });
      
      const chatApplications = Object.values(chatMap);
      res.status(200).json({ chats: chatApplications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching chat applications" });
    }
  };

  exports.getChatApplicationsProjectOfficer = async (req, res) => {
    try {
      // Find all chat records where clerk is either sender or receiver.
      // Populate the entire ApplicationDetails document with the required fields.
      const chats = await Chat.find({
        $or: [
          { from: "project_officer" },
          { to: "project_officer" }
        ]
      })
        .sort({ creationTimeStamp: -1 })
        .populate("appId", "compno receiptid surveyNumber ownerName area address state city pincode status documents");
  
      // Group chats by appId and receiptid combination to get distinct conversations.
      const chatMap = {};
      chats.forEach(chat => {
        // Use the combination of the application id and receiptid as the unique key.
        const key = `${chat.appId._id}-${chat.receiptid}`;
        if (!chatMap[key]) {
          // Use the populated application details
          chatMap[key] = {
            ...chat.appId.toObject(),
            // Ensure receiptid from the chat matches (it should be the same as in ApplicationDetails)
            receiptid: chat.receiptid
          };
        }
      });
      
      const chatApplications = Object.values(chatMap);
      res.status(200).json({ chats: chatApplications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching chat applications" });
    }
  };

  exports.getChatApplicationsMRO = async (req, res) => {
    try {
      // Find all chat records where clerk is either sender or receiver.
      // Populate the entire ApplicationDetails document with the required fields.
      const chats = await Chat.find({
        $or: [
          { from: "mro" },
          { to: "mro" }
        ]
      })
        .sort({ creationTimeStamp: -1 })
        .populate("appId", "compno receiptid surveyNumber ownerName area address state city pincode status documents");
  
      // Group chats by appId and receiptid combination to get distinct conversations.
      const chatMap = {};
      chats.forEach(chat => {
        // Use the combination of the application id and receiptid as the unique key.
        const key = `${chat.appId._id}-${chat.receiptid}`;
        if (!chatMap[key]) {
          // Use the populated application details
          chatMap[key] = {
            ...chat.appId.toObject(),
            // Ensure receiptid from the chat matches (it should be the same as in ApplicationDetails)
            receiptid: chat.receiptid
          };
        }
      });
      
      const chatApplications = Object.values(chatMap);
      res.status(200).json({ chats: chatApplications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching chat applications" });
    }
  };

  exports.getChatApplicationsSurveyor = async (req, res) => {
    try {
      // Find all chat records where clerk is either sender or receiver.
      // Populate the entire ApplicationDetails document with the required fields.
      const chats = await Chat.find({
        $or: [
          { from: "surveyor" },
          { to: "surveyor" }
        ]
      })
        .sort({ creationTimeStamp: -1 })
        .populate("appId", "compno receiptid surveyNumber ownerName area address state city pincode status documents");
  
      // Group chats by appId and receiptid combination to get distinct conversations.
      const chatMap = {};
      chats.forEach(chat => {
        // Use the combination of the application id and receiptid as the unique key.
        const key = `${chat.appId._id}-${chat.receiptid}`;
        if (!chatMap[key]) {
          // Use the populated application details
          chatMap[key] = {
            ...chat.appId.toObject(),
            // Ensure receiptid from the chat matches (it should be the same as in ApplicationDetails)
            receiptid: chat.receiptid
          };
        }
      });
      
      const chatApplications = Object.values(chatMap);
      res.status(200).json({ chats: chatApplications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching chat applications" });
    }
  };

  exports.getChatApplicationsRevenueInspector = async (req, res) => {
    try {
      // Find all chat records where clerk is either sender or receiver.
      // Populate the entire ApplicationDetails document with the required fields.
      const chats = await Chat.find({
        $or: [
          { from: "revenue_inspector" },
          { to: "revenue_inspector" }
        ]
      })
        .sort({ creationTimeStamp: -1 })
        .populate("appId", "compno receiptid surveyNumber ownerName area address state city pincode status documents");
  
      // Group chats by appId and receiptid combination to get distinct conversations.
      const chatMap = {};
      chats.forEach(chat => {
        // Use the combination of the application id and receiptid as the unique key.
        const key = `${chat.appId._id}-${chat.receiptid}`;
        if (!chatMap[key]) {
          // Use the populated application details
          chatMap[key] = {
            ...chat.appId.toObject(),
            // Ensure receiptid from the chat matches (it should be the same as in ApplicationDetails)
            receiptid: chat.receiptid
          };
        }
      });
      
      const chatApplications = Object.values(chatMap);
      res.status(200).json({ chats: chatApplications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching chat applications" });
    }
  };

  exports.getChatApplicationsVRO = async (req, res) => {
    try {
      // Find all chat records where clerk is either sender or receiver.
      // Populate the entire ApplicationDetails document with the required fields.
      const chats = await Chat.find({
        $or: [
          { from: "vro" },
          { to: "vro" }
        ]
      })
        .sort({ creationTimeStamp: -1 })
        .populate("appId", "compno receiptid surveyNumber ownerName area address state city pincode status documents");
  
      // Group chats by appId and receiptid combination to get distinct conversations.
      const chatMap = {};
      chats.forEach(chat => {
        // Use the combination of the application id and receiptid as the unique key.
        const key = `${chat.appId._id}-${chat.receiptid}`;
        if (!chatMap[key]) {
          // Use the populated application details
          chatMap[key] = {
            ...chat.appId.toObject(),
            // Ensure receiptid from the chat matches (it should be the same as in ApplicationDetails)
            receiptid: chat.receiptid
          };
        }
      });
      
      const chatApplications = Object.values(chatMap);
      res.status(200).json({ chats: chatApplications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching chat applications" });
    }
  };

  exports.getChatApplicationsRDO = async (req, res) => {
    try {
      // Find all chat records where clerk is either sender or receiver.
      // Populate the entire ApplicationDetails document with the required fields.
      const chats = await Chat.find({
        $or: [
          { from: "revenue_dept_officer" },
          { to: "revenue_dept_officer" }
        ]
      })
        .sort({ creationTimeStamp: -1 })
        .populate("appId", "compno receiptid surveyNumber ownerName area address state city pincode status documents");
  
      // Group chats by appId and receiptid combination to get distinct conversations.
      const chatMap = {};
      chats.forEach(chat => {
        // Use the combination of the application id and receiptid as the unique key.
        const key = `${chat.appId._id}-${chat.receiptid}`;
        if (!chatMap[key]) {
          // Use the populated application details
          chatMap[key] = {
            ...chat.appId.toObject(),
            // Ensure receiptid from the chat matches (it should be the same as in ApplicationDetails)
            receiptid: chat.receiptid
          };
        }
      });
      
      const chatApplications = Object.values(chatMap);
      res.status(200).json({ chats: chatApplications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching chat applications" });
    }
  };

  exports.getChatApplicationsJC = async (req, res) => {
    try {
      // Find all chat records where clerk is either sender or receiver.
      // Populate the entire ApplicationDetails document with the required fields.
      const chats = await Chat.find({
        $or: [
          { from: "joint_collector" },
          { to: "joint_collector" }
        ]
      })
        .sort({ creationTimeStamp: -1 })
        .populate("appId", "compno receiptid surveyNumber ownerName area address state city pincode status documents");
  
      // Group chats by appId and receiptid combination to get distinct conversations.
      const chatMap = {};
      chats.forEach(chat => {
        // Use the combination of the application id and receiptid as the unique key.
        const key = `${chat.appId._id}-${chat.receiptid}`;
        if (!chatMap[key]) {
          // Use the populated application details
          chatMap[key] = {
            ...chat.appId.toObject(),
            // Ensure receiptid from the chat matches (it should be the same as in ApplicationDetails)
            receiptid: chat.receiptid
          };
        }
      });
      
      const chatApplications = Object.values(chatMap);
      res.status(200).json({ chats: chatApplications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching chat applications" });
    }
  };

  exports.getChatApplicationsDC = async (req, res) => {
    try {
      // Find all chat records where clerk is either sender or receiver.
      // Populate the entire ApplicationDetails document with the required fields.
      const chats = await Chat.find({
        $or: [
          { from: "district_collector" },
          { to: "district_collector" }
        ]
      })
        .sort({ creationTimeStamp: -1 })
        .populate("appId", "compno receiptid surveyNumber ownerName area address state city pincode status documents");
  
      // Group chats by appId and receiptid combination to get distinct conversations.
      const chatMap = {};
      chats.forEach(chat => {
        // Use the combination of the application id and receiptid as the unique key.
        const key = `${chat.appId._id}-${chat.receiptid}`;
        if (!chatMap[key]) {
          // Use the populated application details
          chatMap[key] = {
            ...chat.appId.toObject(),
            // Ensure receiptid from the chat matches (it should be the same as in ApplicationDetails)
            receiptid: chat.receiptid
          };
        }
      });
      
      const chatApplications = Object.values(chatMap);
      res.status(200).json({ chats: chatApplications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching chat applications" });
    }
  };
  exports.getChatApplicationsMW = async (req, res) => {
    try {
      // Find all chat records where clerk is either sender or receiver.
      // Populate the entire ApplicationDetails document with the required fields.
      const chats = await Chat.find({
        $or: [
          { from: "ministry_welfare" },
          { to: "ministry_welfare" }
        ]
      })
        .sort({ creationTimeStamp: -1 })
        .populate("appId", "compno receiptid surveyNumber ownerName area address state city pincode status documents");
  
      // Group chats by appId and receiptid combination to get distinct conversations.
      const chatMap = {};
      chats.forEach(chat => {
        // Use the combination of the application id and receiptid as the unique key.
        const key = `${chat.appId._id}-${chat.receiptid}`;
        if (!chatMap[key]) {
          // Use the populated application details
          chatMap[key] = {
            ...chat.appId.toObject(),
            // Ensure receiptid from the chat matches (it should be the same as in ApplicationDetails)
            receiptid: chat.receiptid
          };
        }
      });
      
      const chatApplications = Object.values(chatMap);
      res.status(200).json({ chats: chatApplications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching chat applications" });
    }
  };


