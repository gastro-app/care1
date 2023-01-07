/* eslint-disable react/button-has-type */
/* eslint-disable new-cap */
import React from 'react';
import jsPDF from 'jspdf';

function MedicalReport() {
  // Function to generate the PDF
  const generatePDF = () => {
    // Create the document
    const pageWidth = 210; // 210mm
    const pageHeight = 297; // 297mm

    // Create the document
    const doc = new jsPDF({
      unit: 'mm',
      format: [pageWidth, pageHeight]
    });
    // Set the font and text size
    doc.setFont('helvetica');
    doc.setFontSize(12);
    doc.text(`Compte Rendu d'examen endoscopique`, pageWidth / 2, 20, {
      align: 'center'
    });
    let x = 10;
    // Add the hospital name to the top left corner
    doc.text('Rapport Medical', 10, x, { align: 'left' });

    // Add the doctor name to the top right corner
    doc.text('etablissmeent', 190, x, { align: 'right' });

    // Add patient information
    doc.text('Patient : John Doe', 14, (x += 40));
    doc.text('Age: 25 ans', 14, (x += 10));
    doc.text('Date of Birth: 01/01/1970', 14, (x += 10));
    doc.text('Numero de dossier : 19548', 14, (x += 10));
    doc.text('Indications: 1,2,3,4,5', 14, (x += 10));
    doc.line(20, (x += 10), 180, x);
    doc.text('sous anesthesie generale: lorem ipsum', 14, (x += 10));
    doc.text('heure de debut: 1/6/2023 20:38', 14, (x += 10), { align: 'left' });

    // Add the doctor name to the top right corner
    doc.text("durée de l'examen: 60 minutes", 190, x, { align: 'right' });
    const materials = ['1', '2'];
    doc.text(`material: ${materials[0]}`, 14, (x += 10));
    for (let i = 1; i < materials.length; i += 1) doc.text(`${materials[i]}`, 32, (x += 10));
    // Add a section for the doctor's notes
    doc.text("Doctor's Notes:", 14, (x += 10));

    // Add a line for the doctor to write their notes

    // Add a section for the test results
    doc.text('Test Results:', 14, (x += 10));

    // Save the PDF
    doc.save('medical-report.pdf');
  };

  return (
    <div>
      {/* Button to trigger the PDF generation */}
      <button onClick={generatePDF}>Generate PDF</button>
    </div>
  );
}

export default MedicalReport;
