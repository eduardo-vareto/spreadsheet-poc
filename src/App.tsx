import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { HyperFormula, SimpleCellAddress } from "hyperformula";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { BaseColDefParams } from "ag-grid-community/dist/lib/entities/colDef";

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
    ["Toyota", "Celica", 35000],
    ["Ford", "Mondeo", 32000],
    ["Porsche", "Boxster", 72000],
    ["Total", "", "=SUM(C1:C3)"],
  ]);

  const gridValues = rowData.map(([make, model, price]) => ({
    make,
    model,
    price,
  }));

  const hf = useRef(HyperFormula.buildFromArray(rowData, options));

  useEffect(() => {
    hf.current?.on("valuesUpdated", (changes) => {
      console.log(changes);
    });
  }, []);

  const columnsInvertedIndex = columnDefs.reduce((acc, c, i) => {
    acc.set(c.field, i);
    return acc;
  }, new Map<string, number>());

  const getCellAddess = (param: BaseColDefParams): SimpleCellAddress => {
    const col = columnsInvertedIndex.get(param.column.getColId())!;
    const row = param.node!.rowIndex!;
    return { col, row, sheet: 0 };
  };

  const defaultColDef: ColDef = useMemo(
    () => ({
      editable: true,
      valueGetter: (p) => {
        const address = getCellAddess(p);
        return (
          hf.current?.getCellFormula(address) ||
          hf.current?.getCellValue(address)
        );
      },
      valueSetter: (p) => {
        const address = getCellAddess(p);
        hf.current?.setCellContents(address, [[p.newValue]]);
        return true;
      },
      valueFormatter: (p) => {
        const address = getCellAddess(p);
        const value = hf.current?.getCellValue(address);
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
