const sourceIndexColumn = 13; // Index column in the source data (1-based indexing)
const targetIndexColumn = 22; // Index column in the target sheet (1-based indexing)

// Column mappings for different scenarios
const columnMappingOption1 = [ , , , , , , , , , , , , , , 11, 12, , , , , , ]; // Example columns for the first type
const columnMappingOption2 = [ , , , , , , , , , , , , , , , , , , , 11, 12, ]; // Example columns for the second type

function getColumnMapping(sheetName) {
if (sheetName.includes("Males-25 M Assisted Walk") || sheetName.includes("Males-25 M Assisted Device") || sheetName.includes("Males-25 M Assisted WC") || sheetName.includes("Males-25 M Manual WC") || sheetName.includes("Males-30 M Slalom") || sheetName.includes("Males-50 M Run") || sheetName.includes("Males-50 M Manual WC") || sheetName.includes("Males-100 M Run") || sheetName.includes("Females-25 M Assisted Walk") || sheetName.includes("Females-25 M Assisted Device") || sheetName.includes("Females-25 M Assisted WC") || sheetName.includes("Females-25 M Manual WC") || sheetName.includes("Females-30 M Slalom") || sheetName.includes("Females-50 M Run") || sheetName.includes("Females-50 M Manual WC") || sheetName.includes("Females-100 M Run")) {
    return columnMappingOption1; // Return columns for first sheet type
  } else if (sheetName.includes("Males-Turbo Jav") || sheetName.includes("Males-Tennis Ball Throw") || sheetName.includes("Males-Softball Throw") || sheetName.includes("Males-Running Long Jump") || sheetName.includes("Males-Foam Turbo Jav") || sheetName.includes("Males-Bean Bag Throw") || sheetName.includes("Females-Turbo Jav") || sheetName.includes("Females-Tennis Ball Throw") || sheetName.includes("Females-Softball Throw") || sheetName.includes("Females-Running Long Jump") || sheetName.includes("Females-Foam Turbo Jav") || sheetName.includes("Females-Bean Bag Throw")) {
    return columnMappingOption2; // Return columns for second sheet type
  } else {
    throw new Error("No matching column mapping for sheet: " + sheetName); // Handle unmatched cases
  }
}

function createTargetMap(targetSheet, targetIndexColumn) {
  const targetData = targetSheet.getDataRange().getValues(); // Get all data in the target sheet
  const targetMap = new Map();

  targetData.forEach((row, index) => {
    const key = row[targetIndexColumn - 1]; // Convert 1-based to 0-based index
    if (key) {
      targetMap.set(key, { index: index, row: row }); // Store row index and row data
    }
  });

  return targetMap;
}

function generateSourceKey(row, sourceIndexColumn) {
  return row[sourceIndexColumn - 1]; // Extract the key from the source data (1-based to 0-based)
}

function updateTargetSheet(sourceData, targetSheet, columnMapping, targetMap, sourceIndexColumn, targetIndexColumn) {
  const updates = [];
  const newEntries = [];

  sourceData.forEach((row) => {
    const key = generateSourceKey(row, sourceIndexColumn); // Get the key from the source data

    if (targetMap.has(key)) {
      const targetRow = targetMap.get(key); // Get the matching target row
      updates.push({ index: targetRow.index, row: row }); // Add it to the updates
    } else {
      newEntries.push(row); // If no match, add to new entries
    }
  });

  // Apply the updates to the target sheet
  updates.forEach((update) => {
    const rowIndex = update.index + 1; // Google Sheets are 1-indexed
    // const mappedData = extractMappedColumns(update.row, columnMapping); // Extract data for specified columns
    
    // // Set the values in the correct columns in the target sheet
    // columnMapping.forEach((col, i) => {
    //   targetSheet.getRange(rowIndex, col).setValue(mappedData[i]);
    // });
    let mappedData;

    if (columnMapping === columnMappingOption1) {
      // For columnMappingOption1, map data from columns 11, 12, and 13 of the source data to columns 15, 16, and 22 of the target sheet
      mappedData = [update.row[10], update.row[11]]; // Extract data from columns 11, 12
      targetSheet.getRange(rowIndex, 15, 1, 2).setValues([mappedData]); // Set the values in columns 15, 16, and 22 of the target sheet
    } else if (columnMapping === columnMappingOption2) {
      // For columnMappingOption2, map data from columns 11, 12, and 13 of the source data to columns 20, 21, and 22 of the target sheet
      mappedData = [update.row[10], update.row[11], update.row[12]]; // Extract data from columns 11, 12, and 13
      targetSheet.getRange(rowIndex, 20, 1, 3).setValues([mappedData]); // Set the values in columns 20, 21, and 22 of the target sheet
    }
  });

  // Insert new entries at the end
  // if (newEntries.length > 0) {
  //   const rearrangedNewEntries = newEntries.map((row) => extractMappedColumns(row, columnMapping)); // Rearrange new entries
  //   const lastRow = targetSheet.getLastRow(); // Index of the last row in the target sheet

  //   rearrangedNewEntries.forEach((entry, index) => {
  //     entry.forEach((value, i) => {
  //       targetSheet.getRange(lastRow + index + 1, columnMapping[i]).setValue(value); // Insert at the correct column
  //     });
  //   });
  // }

  if (newEntries.length > 0) {
    const lastRow = targetSheet.getLastRow(); // Index of the last row in the target sheet

    newEntries.forEach((entry) => {
      let mappedData;

      if (columnMapping === columnMappingOption1) {
        // For columnMappingOption1, map data from columns 11, 12, and 13 of the source data to columns 15, 16, and 22 of the target sheet
        mappedData = [entry[10], entry[11], entry[12]]; // Extract data from columns 11, 12, and 13
        targetSheet.getRange(lastRow + 1, 15, 1, 3).setValues([mappedData]); // Set the values at the end of columns 15, 16, and 22 of the target sheet
      } else if (columnMapping === columnMappingOption2) {
        // For columnMappingOption2, map data from columns 11, 12, and 13 of the source data to columns 20, 21, and 22 of the target sheet
        mappedData = [entry[10], entry[11], entry[12]]; // Extract data from columns 11, 12, and 13
        targetSheet.getRange(lastRow + 1, 20, 1, 3).setValues([mappedData]); // Set the values at the end of columns 20, 21, and 22 of the target sheet
      }

      lastRow++; // Increment lastRow for the next iteration
    });
  }
}

function extractMappedColumns(row, columnMapping) {
  
  return columnMapping.map((col) => row[col - 1]); // Convert 1-based to 0-based
}

function pushDataToMainSheet() {
    Utilities.sleep(1000);  // Wait for 1 second
    
  const targetSpreadsheetId = '1i0_rk0_5HRlOIS8zEpbPOXp4fftY6pj4m0tseO8Aa4s'; // SO Student Database
  const targetSheetName = 'Student Database'; // Student Database
  
  const currentSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet(); // Get the current sheet
  const sheetName = currentSheet.getName(); // Name of the current sheet

  // The lines below are for debugging. After debugging, uncomment the lines above and comment the ones below out
  // const sheetWithNewHeatDataId = '1zfk7plACYxlfcO-3tgDXiYgk4FkObANmBCZpWSHPAiA';
  // const sheetWithNewHeadData = SpreadsheetApp.openById(sheetWithNewHeatDataId);
  // const currentSheet = sheetWithNewHeadData.getSheetByName("Males-Turbo Jav");
  // const sheetName = currentSheet.getName();

  const sourceData = currentSheet.getDataRange().getValues().slice(1); // Source data to update the target sheet, excluding the first row
  const columnMapping = getColumnMapping(sheetName); // Determine the correct column mapping

  const targetSpreadsheet = SpreadsheetApp.openById(targetSpreadsheetId);
  const targetSheet = targetSpreadsheet.getSheetByName(targetSheetName); // Get the target sheet
  
  // Create a map of the target data using the target index column
  const targetMap = createTargetMap(targetSheet, targetIndexColumn);

  updateTargetSheet(sourceData, targetSheet, columnMapping, targetMap, sourceIndexColumn, targetIndexColumn); // Update the target sheet
}
