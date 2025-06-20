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

// Transaction type: startDate and endDate are strings in YYYY-MM-DD format
type Transaction = {
  id: string;
  name: string;
  amount: string;
  dayOfMonth: string;
  transactionType: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  accountName: string; // <-- Added
};

const initialPayments: Transaction[] = [];

const Example = ({
  transactions,
  setTransactions,
}: {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
}) => {
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
      {
        accessorKey: 'accountName', // <-- Added
        header: 'Account Name',     // <-- Added
        muiEditTextFieldProps: {    // <-- Added
          required: true,           // <-- Added
          error: !!validationErrors?.accountName, // <-- Added
          helperText: validationErrors?.accountName, // <-- Added
          onFocus: () =>            // <-- Added
            setValidationErrors({   // <-- Added
              ...validationErrors,  // <-- Added
              accountName: undefined, // <-- Added
            }),                    // <-- Added
        },                         // <-- Added
      },                           // <-- Added
      // --- startDate column ---
      {
        accessorKey: 'startDate',
        header: 'Start Date',
        Cell: ({ cell }) => cell.getValue<string>() || '',
        muiEditTextFieldProps: {
          required: false,
          type: 'date',
          error: !!validationErrors?.startDate,
          helperText: validationErrors?.startDate,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              startDate: undefined,
            }),
        },
      },
      // --- endDate column ---
      {
        accessorKey: 'endDate',
        header: 'End Date',
        Cell: ({ cell }) => cell.getValue<string>() || '',
        muiEditTextFieldProps: {
          required: false,
          type: 'date',
          error: !!validationErrors?.endDate,
          helperText: validationErrors?.endDate,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              endDate: undefined,
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

      const newTransaction = { ...values };

      const query = `
        mutation createTransaction(
          $name: String!,
          $amount: String!,
          $dayOfMonth: Int!,
          $transactionType: String!,
          $startDate: Date,
          $endDate: Date,
          $accountName: String!           # <-- Added
        ) {
          createTransaction(
            name: $name,
            amount: $amount,
            dayOfMonth: $dayOfMonth,
            transactionType: $transactionType,
            startDate: $startDate,
            endDate: $endDate,
            accountName: $accountName     # <-- Added
          )
        }
      `;
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
            startDate: newTransaction.startDate || null,
            endDate: newTransaction.endDate || null,
            accountName: newTransaction.accountName, // <-- Added
          }
        })
      })
        .then((response) => response.json())
        .then((json) => {
          if (json?.errors) {
            console.error("GraphQL errors:", json.errors);
            return;
          }
          newTransaction.id = json?.data?.createTransaction;
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
        mutation updateTransaction(
          $id: ID!,
          $name: String!,
          $amount: String!,
          $dayOfMonth: Int!,
          $transactionType: String!,
          $startDate: Date,
          $endDate: Date,
          $accountName: String!           # <-- Added
        ) {
          updateTransaction(
            id: $id,
            name: $name,
            amount: $amount,
            dayOfMonth: $dayOfMonth,
            transactionType: $transactionType,
            startDate: $startDate,
            endDate: $endDate,
            accountName: $accountName     # <-- Added
          )
        }
      `;
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
            startDate: values.startDate || null,
            endDate: values.endDate || null,
            accountName: values.accountName, // <-- Added
          }
        })
      })
        .then((response) => response.json())
        .then((json) => {
          if (json?.errors) {
            console.error("GraphQL errors:", json.errors);
            return;
          }
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
        .then((response) => response.json())
        .then((json) => {
          if (json?.errors) {
            console.error("GraphQL errors:", json.errors);
            return;
          }
          setTransactions(
            transactions.filter((transaction) => transaction.id !== row.original.id)
          );
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
  const [transactions, setTransactions] = useState<Transaction[]>(initialPayments);
  const [isClient, setIsClient] = useState(false);

  const query = `
    query getTransactions {
      getTransactions {
        id
        name
        amount
        dayOfMonth
        transactionType
        startDate
        endDate
        accountName   # <-- Added
      }
    }
  `;

  useEffect(() => {
    setIsClient(true);
    fetch(`/api/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: {},
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json?.errors) {
          console.error("GraphQL errors:", json.errors);
          return;
        }
        setTransactions(json?.data?.getTransactions);
      })
      .catch((error) => {
        console.error("Error fetching data from GraphQL response:", error);
      });
  }, []);

  if (!isClient) return null;

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
    dayOfMonth: !validateRequiredInt(parseInt(user?.dayOfMonth?.toString()))
      ? 'Day of month is Required'
      : '',
    transactionType: !validateRequired(user.transactionType)
      ? 'Transaction type is Required'
      : '',
    accountName: !validateRequired(user.accountName) ? 'Account Name is Required' : '', // <-- Added
    // Optionally require startDate/endDate:
    // startDate: !validateRequired(user.startDate ?? '') ? 'Start date is Required' : '',
    // endDate: !validateRequired(user.endDate ?? '') ? 'End date is Required' : '',
  };
}
