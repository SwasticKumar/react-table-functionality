import React, { useState, useRef } from "react";
import "./DynamicTable.css";

const DynamicTable = () => {
  const initialColumns = 4;
  const initialRows = 4;

  const totalTableWidth = 600;
  const minColumnWidth = 20;

  const initialWidth = totalTableWidth / initialColumns;
  const [columnWidths, setColumnWidths] = useState(
    Array(initialColumns).fill(initialWidth)
  );

  const [tableData, setTableData] = useState(
    Array.from({ length: initialRows }, () =>
      Array.from({ length: initialColumns }, () => "")
    )
  );

  const resizingColumn = useRef(null);

  const handleMouseDownCol = (index, e) => {
    resizingColumn.current = {
      index,
      startX: e.clientX,
      startWidths: [...columnWidths],
    };

    document.addEventListener("mousemove", handleMouseMoveCol);
    document.addEventListener("mouseup", handleMouseUpCol);
  };

  const handleMouseMoveCol = (e) => {
    if (!resizingColumn.current) return;

    const { index, startX, startWidths } = resizingColumn.current;
    const diff = e.clientX - startX;

    let newWidth1 = Math.max(minColumnWidth, startWidths[index] + diff);
    let newWidth2 = Math.max(minColumnWidth, startWidths[index + 1] - diff);

    if (newWidth1 + newWidth2 === startWidths[index] + startWidths[index + 1]) {
      setColumnWidths((prev) =>
        prev.map((w, i) =>
          i === index ? newWidth1 : i === index + 1 ? newWidth2 : w
        )
      );
    }
  };

  const handleMouseUpCol = () => {
    document.removeEventListener("mousemove", handleMouseMoveCol);
    document.removeEventListener("mouseup", handleMouseUpCol);
    resizingColumn.current = null;
  };

  return (
    <div className="containerTable my-4 table-container-fluid text-center">
      <table
        className="table table-dark table-hover table-bordered table-striped"
        style={{ width: `${totalTableWidth}px` }}
      >
        <thead>
          <tr>
            {columnWidths.map((width, colIndex) => (
              <th
                key={colIndex}
                style={{ width: `${width}px`, position: "relative" }}
              >
                Column {colIndex + 1}
                {colIndex < columnWidths.length - 1 && (
                  <span
                    className="resize-handle"
                    onMouseDown={(e) => handleMouseDownCol(colIndex, e)}
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  contentEditable
                  style={{ width: `${columnWidths[colIndex]}px` }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
