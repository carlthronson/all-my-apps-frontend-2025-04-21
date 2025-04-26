import { useMemo, useState, useCallback } from 'react';
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

const initialPayments: Transaction[] = [
 {
  id: '1',
  name: 'IRS',
  amount: '520',
  dayOfMonth: '10',
  transactionType: 'payment',
 },
 {
  id: '2',
  name: 'First Paycheck',
  amount: '4986',
  dayOfMonth: '15',
  transactionType: 'deposit',
 },
 {
  id: '3',
  name: 'Second Paycheck',
  amount: '4986',
  dayOfMonth: '31',
  transactionType: 'deposit',
 },
];

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
    id: (Math.random() + 1).toString(36).substring(7),
   };
   setTransactions([...transactions, newTransaction]);

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

   setTransactions(
    transactions.map((transaction) =>
     transaction.id === values.id ? values : transaction
    )
   );
   table.setEditingRow(null);
  };

 const handleDeleteRow = useCallback((row: MRT_Row<Transaction>) => {
  if (window.confirm('Are you sure you want to delete this transaction?')) {
   setTransactions(
    transactions.filter((transaction) => transaction.id !== row.original.id)
   );
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

 return (
  <>
   <p>{JSON.stringify(transactions)}</p>
   <Example transactions={transactions} setTransactions={setTransactions} />
  </>
 );
}

const validateRequired = (value: string) => !!value.length;

function validateTransaction(user: Transaction) {
 return {
  name: !validateRequired(user.name) ? 'Name is Required' : '',
  amount: !validateRequired(user.amount) ? 'Amount is Required' : '',
  dayOfMonth: !validateRequired(user.dayOfMonth) ? 'Day of month is Required' : '',
  transactionType: !validateRequired(user.transactionType)
   ? 'Transaction type is Required'
   : '',
 };
}
