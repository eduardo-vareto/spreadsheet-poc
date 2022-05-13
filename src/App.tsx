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
  const [columnDefs] = useState([
    { field: "make" },
    { field: "model" },
    { field: "price" },
  ]);

  const [rowData] = useState([
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxster", price: 72000 },
  ]);

  const hfData = [...rowData.map(Object.values), ["Total", "", "=SUM(C1:C3)"]];

  const hf = HyperFormula.buildFromArray(hfData, options);

  const columnsInvertedIndex = columnDefs.reduce((acc, c, i) => {
    acc.set(c.field, i);
    return acc;
  }, new Map<string, number>());

  const gridValues = hfData.map(([make, model, price]) => ({
    make,
    model,
    price,
  }));

  const defaultColDef: ColDef = useMemo(
    () => ({
      editable: true,
      valueFormatter: (p) => {
        const col = columnsInvertedIndex.get(p.column.getColId())!;
        const row = p.node!.rowIndex!;
        const value = hf.getCellValue({ col, row, sheet: 0 });
        return value!.toString();
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
