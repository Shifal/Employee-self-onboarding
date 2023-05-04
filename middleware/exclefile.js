const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx"); // use the correct module name

function saveExcelSheet(dirPath) {
  // create directory if it does not exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  return async function(req, res, next) {
    try {
      const workbook = req.excelWorkbook || xlsx.utils.book_new();
      const filename = req.excelFilename || "sheet.xlsx";
      const filePath = path.join(dirPath, filename);
      
      // Add a new worksheet
      const worksheet = xlsx.utils.json_to_sheet(req.applications);

      // Add the worksheet to the workbook
      xlsx.utils.book_append_sheet(workbook, worksheet, "Applications");

      // Convert the workbook to a buffer
      const excelBuffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });

      // Write the buffer to a file
      fs.writeFileSync(filePath, excelBuffer);

      console.log(`Excel sheet saved to ${filePath}`);
      
      next();
    } catch (err) {
      console.error(err);
      res.status(500).send("Error saving Excel sheet");
    }
  }
}

module.exports = saveExcelSheet;