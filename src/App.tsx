import { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { HyperFormula } from "hyperformula";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

const options = {
  licenseKey: "gpl-v3",
};

const App = () => {
  const [rowData] = useState([
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxster", price: 72000 },
  ]);

  const hfData = [...rowData.map(Object.values), ["Total", "", "=SUM(C1:C3)"]];

  const hf = HyperFormula.buildFromArray(hfData, options);
  const sheetValues = hf.getSheetValues(0);

  const [columnDefs] = useState([
    { field: "make" },
    { field: "model" },
    { field: "price" },
  ]);

  console.log(sheetValues);
  const gridValues = sheetValues.map(([make, model, price]) => ({
    make,
    model,
    price,
  }));

  const defaultColDef: ColDef = useMemo(
    () => ({
      editable: true,
      valueFormatter: (p) => {
        console.log(Object.keys(p));
        return `${p.column.getId()} ${p.value}`;
      },
    }),
    []
  );

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: 800 }}>
      <AgGridReact
        defaultColDef={defaultColDef}
        undoRedoCellEditing={true}
        rowData={gridValues}
        columnDefs={columnDefs}
      ></AgGridReact>
    </div>
  );
};

export default App;
