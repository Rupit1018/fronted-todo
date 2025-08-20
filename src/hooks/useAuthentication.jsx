import { useDispatch } from "react-redux";
import {
  forgotPasswordAction,
  getUserAction,
  loginAction,
  logoutAction,
  signUpAction,
} from "../store/actions/auth.action";
import { useAuth } from "../context/AuthContext";
import {
  acceptInvitationAction,
  cancelInvitationAction,
  createOrgAction,
  deleteOrgAction,
  getInvitationsAction,
  getOrgsAction,
  updateOrgAction,
  inviteUserAction,
  getInvitationAction
} from "../store/actions/org.action";
import {
  createTodoAction,
  deleteTodoAction,
  getTodosAction,
  updateTodoAction,
} from "../store/actions/todo.action";
import { getOrgDetailsAction, updateMemberRoleAction } from "../store/actions/user.action";

const useAuthentication = () => {
  const dispatch = useDispatch();
  const { setAuthUser } = useAuth();

  const login = async (body) => {
    return dispatch(loginAction(body));
  };

  const signup = async (body) => {
    return dispatch(signUpAction(body));
  };

  const logout = async () => {
    await dispatch(logoutAction());
    setAuthUser(null);
  };

  const ForgotPassword = async (email) => {
    return dispatch(forgotPasswordAction(email));
  };

    const authMe= async () => {
      return dispatch(getUserAction())
    }

  // Orgs

  const getOrgs = async (arg) => {
    return dispatch(getOrgsAction(arg));
  };

  const createOrg = async (orgData) => {
    return dispatch(createOrgAction(orgData));
  };

  const deleteOrg = async (orgId) => {
    return dispatch(deleteOrgAction(orgId));
  };

  const updateOrg = async ({ orgId, orgData }) => {
    return dispatch(updateOrgAction({ orgId, orgData }));
  };

  // groups

  const inviteAction = async (groupData) => {
    return dispatch(inviteUserAction(groupData));
  };

 const getGroups = (orgId) => {
  return dispatch(getInvitationsAction(orgId)).unwrap();
};

const getInvitation = async () => {
    return dispatch(getInvitationAction());
  }
  const acceptInvitation = async (invId) => {
    return dispatch(acceptInvitationAction(invId));
  };

  const cancelInvitation = async (inviteId) => {
    return dispatch(cancelInvitationAction(inviteId));
  };

  // Todo

  const craeateTodo = async (todoData) => {
    return dispatch(createTodoAction(todoData));
  };

  const getTodos = async (orgId) => {
    return dispatch(getTodosAction(orgId));
  };

  const deleteTodo = async ({ todoId, orgId }) => {
    return dispatch(deleteTodoAction({ todoId, orgId }));
  };

  const updateTodo = async ({ todoId, orgId, todoData }) => {
    return dispatch(updateTodoAction({ todoId, orgId, todoData }));
  };



  // Org Members
  
  const updateMemberRole = async ({ orgId, memberId, role }) => {
    return dispatch(updateMemberRoleAction({ orgId, memberId, role }));
  };

const getOrgDetails = async (orgId) => {
  return dispatch(getOrgDetailsAction(orgId)); // orgId must be organizationId
};

  return {
    authMe,
    updateMemberRole,
    getOrgDetails,
    login,
    signup,
    logout,
    ForgotPassword,
    getOrgs,
    createOrg,
    deleteOrg,
    updateOrg,
    craeateTodo,
    getTodos,
    deleteTodo,
    updateTodo,
    inviteAction,
    getGroups,
    acceptInvitation,
    cancelInvitation,
    getInvitation
  };
};

export default useAuthentication;
