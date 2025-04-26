"use client";
import { useMemo, useState, useCallback, useEffect } from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

type Transaction = {
  id: string;
  name: string;
  amount: string;
  dayOfMonth: string;
  transactionType: string;
};

const initialPayments: Transaction[] = [];

const Example = ({ transactions, setTransactions }: { transactions: Transaction[]; setTransactions: (transactions: Transaction[]) => void }) => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useMemo<MRT_ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.name,
          helperText: validationErrors?.name,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              name: undefined,
            }),
        },
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.amount,
          helperText: validationErrors?.amount,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              amount: undefined,
            }),
        },
      },
      {
        accessorKey: 'dayOfMonth',
        header: 'Day of Month',
        muiEditTextFieldProps: {
          type: 'number',
          required: true,
          error: !!validationErrors?.dayOfMonth,
          helperText: validationErrors?.dayOfMonth,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              dayOfMonth: undefined,
            }),
        },
      },
      {
        accessorKey: 'transactionType',
        header: 'Transaction Type',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.transactionType,
          helperText: validationErrors?.transactionType,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              transactionType: undefined,
            }),
        },
      },
    ],
    [validationErrors],
  );

  const handleCreateTransaction: MRT_TableOptions<Transaction>['onCreatingRowSave'] =
    async ({ values, table }) => {
      const newValidationErrors = validateTransaction(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});

      const newTransaction = {
        ...values,
        // id: (Math.random() + 1).toString(36).substring(7),
      };

      const query = `
        mutation createTransaction($name: String!, $amount: String!, $dayOfMonth: Int!, $transactionType: String!) {
          createTransaction(name: $name, amount: $amount, dayOfMonth: $dayOfMonth, transactionType: $transactionType)
        }
      `;
      console.log("query: " + query);

      fetch(`/api/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          variables: {
            name: newTransaction.name,
            amount: newTransaction.amount,
            dayOfMonth: Number(newTransaction.dayOfMonth),
            transactionType: newTransaction.transactionType,
          }
        })
      })
        .then((response) => {
          const json = response.json();
          console.log("Response from GraphQL:", json);
          return json;
        })
        .then((json) => {
          if (json?.errors) {
            console.error("GraphQL errors:", json.errors);
            return;
          }
          console.log("json: " + JSON.stringify(json));
          newTransaction.id = json?.data?.createTransaction;
          // console.log("transactions: " + JSON.stringify(json.data.getTransactions));
          setTransactions([...transactions, newTransaction]);

        })
        .catch((error) => {
          console.error("Error fetching data from GraphQL response:", error);
        });

      table.setCreatingRow(null);
    };

  const handleSaveTransaction: MRT_TableOptions<Transaction>['onEditingRowSave'] =
    async ({ values, table }) => {
      const newValidationErrors = validateTransaction(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});

      const query = `
        mutation updateTransaction($id: ID!, $name: String!, $amount: String!, $dayOfMonth: Int!, $transactionType: String!) {
          updateTransaction(id: $id, name: $name, amount: $amount, dayOfMonth: $dayOfMonth, transactionType: $transactionType)
        }
      `;
      console.log("query: " + query);
      fetch(`/api/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          variables: {
            id: values.id,
            name: values.name,
            amount: values.amount,
            dayOfMonth: Number(values.dayOfMonth),
            transactionType: values.transactionType,
          }
        })
      })
        .then((response) => {
          const json = response.json();
          console.log("Response from GraphQL:", json);
          return json;
        })
        .then((json) => {
          if (json?.errors) {
            console.error("GraphQL errors:", json.errors);
            return;
          }
          console.log("json: " + JSON.stringify(json));
          // Update the transaction in the local state
          setTransactions(
            transactions.map((transaction) =>
              transaction.id === values.id ? values : transaction
            )
          );
        })
        .catch((error) => {
          console.error("Error fetching data from GraphQL response:", error);
        });
      table.setEditingRow(null);
    };

  const handleDeleteRow = useCallback((row: MRT_Row<Transaction>) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const query = `
        mutation deleteTransaction($id: ID!) {
          deleteTransaction(id: $id)
        }
      `;
      console.log("query: " + query);

      fetch(`/api/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          variables: {
            id: row.original.id,
          }
        })
      })
        .then((response) => {
          const json = response.json();
          console.log("Response from GraphQL:", json);
          return json;
        })
        .then((json) => {
          if (json?.errors) {
            console.error("GraphQL errors:", json.errors);
            return;
          }
          setTransactions(
            transactions.filter((transaction) => transaction.id !== row.original.id)
          );
          // console.log("transactions: " + JSON.stringify(json.data.getTransactions));
        })
        .catch((error) => {
          console.error("Error fetching data from GraphQL response:", error);
        });
    }
  }, [transactions, setTransactions]);

  const table = useMaterialReactTable({
    columns,
    data: transactions,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.id,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateTransaction,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveTransaction,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Transaction</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit Transaction</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => handleDeleteRow(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        Create New Transaction
      </Button>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default function ExampleTable() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialPayments); // Use local state
  // const [transactions, setTasks] = useState([]);
  // const [mode, setMode] = useState('READONLY');
  const [isClient, setIsClient] = useState(false)

  const query = `
    query getTransactions {
        getTransactions {
          id
          name
          amount
          dayOfMonth
          transactionType
        }
      }
    `;
  console.log("query: " + query);

  useEffect(() => {
    setIsClient(true) // Only runs on client
    fetch(`/api/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: {
        }
      })
    })
      .then((response) => {
        const json = response.json();
        console.log("Response from GraphQL:", json);
        return json;
      })
      .then((json) => {
        if (json?.errors) {
          console.error("GraphQL errors:", json.errors);
          return;
        }
        setTransactions(json?.data?.getTransactions);
        console.log("transactions: " + JSON.stringify(json.data.getTransactions));
      })
      .catch((error) => {
        console.error("Error fetching data from GraphQL response:", error);
      });
    // setMode(status === 'authenticated' ? 'LIVE' : 'READONLY');
  }, []);

  if (!isClient) return null // Server renders nothing

  return (
    <Example transactions={transactions} setTransactions={setTransactions} />
  );
}

const validateRequired = (value: string) => !!value.length;

const validateRequiredInt = (value: number) => !!value;

function validateTransaction(user: Transaction) {
  return {
    name: !validateRequired(user.name) ? 'Name is Required' : '',
    amount: !validateRequired(user.amount) ? 'Amount is Required' : '',
    dayOfMonth: !validateRequiredInt(parseInt(user?.dayOfMonth?.toString())) ? 'Day of month is Required' : '',
    transactionType: !validateRequired(user.transactionType)
      ? 'Transaction type is Required'
      : '',
  };
}
