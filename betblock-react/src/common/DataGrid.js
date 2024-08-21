import { DataGrid } from '@mui/x-data-grid';
import {styled} from '@mui/material/styles';

// styled grid
const StyledDataGrid = styled(DataGrid)(({theme}) => ({
  '&.MuiDataGrid-root': {
  },
  '& .MuiDataGrid-root': {
    outline: 'none !important',
    minWidth: '100%',
  },
  '& .MuiDataGrid-cell:focus-within': {
    outline: 'none !important',
  },
  '& .MuiDataGrid-row': {
    cursor: 'pointer',
  }
}))

export default function CustomDataGrid({...props}) {
  return (
    <StyledDataGrid {...props} />
  )
}