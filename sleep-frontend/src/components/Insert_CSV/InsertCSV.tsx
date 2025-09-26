import { useState } from "react";
import "./InsertCSV.css";
import Input from "../input/Input";
import Button from "../button/Button";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import { useAuth } from "../../pages/login/Auth";
import { DateTime } from "luxon";

type InsertCSVProps = {
  date: Date | null;
  setDay: React.Dispatch<React.SetStateAction<Date | null>>;
}

const InsertCSV = ({ date, setDay } : InsertCSVProps) => {
  // States
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [csvContent, setCsvContent] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const { userId } = useAuth();

  // Gestisce la selezione del file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);

      // Legge anche il contenuto per mostrare un’anteprima
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === "string") {
          setCsvContent(text);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  // Gestisce l’upload al backend
  const handleUploadCSV = async () => {
    if (!file) {
      alert("Seleziona prima un file CSV!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId?.toString() ?? "");
    formData.append("sleep_date", date ? DateTime.fromJSDate(date).toISODate() ?? "" : "");

    try {
      setDay(null);
      const res = await axios.post(
        "http://localhost:5001/upload-csv",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadStatus(res.data.message || "Upload completato!");
      setDay(date);
    } catch (err) {
      console.error(err);
      setUploadStatus("Errore durante l'upload");
    }
  };


  return (
    <div className="csv-box">
      <Input
        name="Seleziona CSV"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        value={""} // gli input file non usano value
      />

      {fileName && (
        <>
          <div className="csv-preview">
            <p><strong>File caricato:</strong> {fileName}</p>
            <pre className="csv-content">{csvContent}</pre>
          </div>
          <div>
            <Button 
              onClick={handleUploadCSV}
              text="INSERISCI A DB"
              icon={faUpload}
            />
          </div>
        </>
      )}

      {uploadStatus && <p className="csv-status">{uploadStatus}</p>}
    </div>
  );
};

export default InsertCSV;