import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

interface Column<T> {
  key: keyof T;
  header: string;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchField?: keyof T;
  actions?: (item: T) => React.ReactNode;
  isLoading?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  searchField,
  actions,
  isLoading = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");

  const filteredData = searchField
    ? data.filter((item) => {
        const searchValue = item[searchField];
        if (typeof searchValue === "string") {
          return searchValue.toLowerCase().includes(search.toLowerCase());
        }
        return true;
      })
    : data;

  return (
    <Card>
      <CardHeader>
        {searchField && (
          <div className="relative">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key.toString()}>{column.header}</TableHead>
                ))}
                {actions && <TableHead className="text-right">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="h-24 text-center"
                  >
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="h-24 text-center"
                  >
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={`${index}-${column.key.toString()}`}>
                        {column.cell ? column.cell(item) : String(item[column.key])}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell className="text-right">{actions(item)}</TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}