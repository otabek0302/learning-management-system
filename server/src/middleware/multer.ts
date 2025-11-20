import multer from "multer";



const storage = multer.diskStorage({

  destination: "uploads/",

  filename: (_req, file, cb) => {

    cb(null, Date.now() + "-" + file.originalname);

  },

});

export const uploadVideo = multer({

  storage,

  limits: {

    fileSize: 1024 * 1024 * 1000, // 1GB

  },

  fileFilter: (_req, file, cb) => {

    const allowed = ["video/mp4", "video/mkv", "video/mov"];

    if (allowed.includes(file.mimetype)) {

      cb(null, true);

    } else {

      cb(new Error("Invalid video format"));

    }

  },

});

