import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';


// import { users } from 'src/_mock/user';

// import Iconify from 'src/components/iconify';

import { useQuery, useMutation } from '@apollo/client';

import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import {DELETE_USER} from "../../../graphQl/DeleteUser.gql"
import {GET_ALL_USERS} from '../../../graphQl/getAllUsers.gql'
import { emptyRows, applyFilter, getComparator } from '../utils';


// const DELETE_USER = gql`
//   mutation DeleteUser($userIds: [Uuid]!) {
//     deleteUser(userIds: $userIds)
//   }
// `;

// ----------------------------------------------------------------------

export default function UserPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { loading, error, data, refetch } = useQuery(GET_ALL_USERS);

  const [deleteUser] = useMutation(DELETE_USER);

  if (
    loading 
  )
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
      >
        <CircularProgress />
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;
  console.log(data, '.........');

  const userss = data.users.data;

  const rowsPerPageOptions = [10, 20, 30, userss && userss.length > 0 ? 'View All' : null].filter(
    (option) => option !== null
  );

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userss.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = ({ target: { value } }) => {
    setPage(0);
    if (value === 'View All') {
      setRowsPerPage(userss.length);
    } else {
      setRowsPerPage(parseInt(value, 10));
    }
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDeleteUser = async (userId) => {
    try {
      console.log('userId passed to handleDeleteUser:', userId);
      await deleteUser({
        variables: {
          userIds: [userId],
        },
      });
      refetch();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const dataFiltered = applyFilter({
    inputData: userss,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Switcheroo Users</Typography>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={userss.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'totalitems', label: 'Total Items',align:'center' },
                  { id: 'matcheditems', label: 'Matched Items', align: 'center' },
                  { id: 'gender', label: 'Gender', align: 'center' },
                  { id: 'createdat', label: 'Registered ', align: 'center' },
                  { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      id={row.id}
                      name={row.firstName}
                      lastname={row.lastName}
                      totalitems={row.itemCount}
                      status={row.status}
                      email={row.email}
                      avatarUrl={row.avatarUrl}
                      matchedItems={row.matchedItemCount}
                      selected={selected.indexOf(row.id) !== -1}
                      users={row}
                      isDeleted={row.isDeleted}
                      gender={row.gender} 
                      createdAt={row.createdAt}
                      handleDelete={() => handleDeleteUser(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, userss.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={userss.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={rowsPerPageOptions}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
