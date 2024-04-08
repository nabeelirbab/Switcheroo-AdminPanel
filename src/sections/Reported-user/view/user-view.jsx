import { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

const GET_REPORTED_USERS = gql`
  query RestrictedUsers {
    restrictedUsers {
      id
      title
      description
      targetUser {
        id
        avatarUrl
        email
        firstName
        lastName
      }
      createdUser {
        avatarUrl
        email
        firstName
        lastName
      }
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($userIds: [Uuid]!) {
    deleteUser(userIds: $userIds)
  }
`;

export default function UserPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [reportedUsers, setReportedUsers] = useState([]);

  const { loading, error, data } = useQuery(GET_REPORTED_USERS);
  const [deleteUser] = useMutation(DELETE_USER);

  useEffect(() => {
    if (!loading && !error) {
      setReportedUsers(data.restrictedUsers);
    }
  }, [loading, error, data]);

  console.log(reportedUsers, 'Restricted UsERS');

  const rowsPerPageOptions = [
    5,
    10,
    25,
    reportedUsers && reportedUsers.length > 0 ? 'View All' : null,
  ].filter((option) => option !== null);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = reportedUsers.map((user) => user.targetUser[0].email);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, userId) => {
    const selectedIndex = selected.indexOf(userId);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = [...selected, userId];
    } else {
      newSelected = [...selected.slice(0, selectedIndex), ...selected.slice(selectedIndex + 1)];
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = ({ target: { value } }) => {
    setPage(0);
    if (value === 'View All') {
      setRowsPerPage(reportedUsers.length);
    } else {
      setRowsPerPage(parseInt(value, 10));
    }
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
    setPage(0);
  };

  // const handleDeleteUser = async (userId) => {
  //   try {
  //     await deleteUser({ variables: { userIds: [userId] } });
  //     // Filter out the deleted user from reportedUsers
  //     const updatedReportedUsers = reportedUsers.filter((user) => user.targetUser[0].id !== userId);
  //     // Update the reportedUsers state with the updated array
  //     setReportedUsers(updatedReportedUsers);
  //     // Optionally, you can also refetch the data if needed
  //     refetch();
  //   } catch (err) {
  //     console.error('Error deleting user:', err);
  //   }
  // };
  const handleDeleteUser = async (userId) => {
    try {
      if (!userId) {
        console.error('Error deleting item: ItemId is null or undefined');
        return;
      }

      console.log('itemId passed to handleDeleteItem:', userId);
      await deleteUser({
        variables: {
          userIds: [userId],
        },
        refetchQueries: [{ query: GET_REPORTED_USERS }],
      });
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const dataFiltered = applyFilter({
    inputData: reportedUsers,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Reported Users</Typography>
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
                rowCount={reportedUsers.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'title', label: 'Title' },
                  { id: 'email', label: 'Email' },
                  { id: 'description', label: 'Description' },
                  { id: 'reportedby', label: 'Reported By' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .filter((row) => row.targetUser.length > 0)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      id={row.id}
                      targetUser={row.targetUser[0]}
                      createdUser={row.createdUser[0]}
                      title={row.title}
                      description={row.description}
                      selected={selected.indexOf(row.targetUser[0]?.id) !== -1}
                      handleClick={(event) => handleClick(event, row.targetUser[0].id)}
                      handleDeleteUser={() => handleDeleteUser(row.targetUser[0].id)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, reportedUsers.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={dataFiltered.filter((user) => user.targetUser.length > 0).length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={rowsPerPageOptions}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
