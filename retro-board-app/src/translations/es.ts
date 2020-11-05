import { Translation } from './types';
export default {
  Header: {
    subtitle: 'Una buena manera de despotricar ordenadamente',
    logout: 'Cerrar sesión',
    leave: 'Salir',
    summaryMode: 'Modo resumido',
  },
  LanguagePicker: {
    header: 'Escoje un idioma',
  },
  Main: {
    hint: 'Puedes invitar a otros a esta sesión compartiendo la URL',
  },
  Home: {
    welcome: undefined,
  },
  PreviousGame: {
    createdBy: undefined,
    posts: undefined,
    participants: undefined,
    votes: undefined,
    actions: undefined,
  },
  Column: {
    createGroupTooltip: undefined,
  },
  Group: {
    emptyGroupTitle: '',
    emptyGroupContent: '',
  },
  Post: {
    openExtra: undefined,
    closeExtra: undefined,
    vote: 'vote',
    votes: 'votos',
    deleteButton: 'Suprimir',
    setActionButton: undefined,
    setGiphyButton: undefined,
    noContent: '(Esta publicacion no tiene contenido)',
    by: undefined,
    upVote: undefined,
    downVote: undefined,
    voteRemainingMultiple: undefined,
    voteRemainingOne: undefined,
    voteRemainingNone: undefined,
    toggleGiphyButton: undefined,
  },
  Customize: {
    title: undefined,
    votingCategory: undefined,
    votingCategorySub: undefined,
    postCategory: undefined,
    postCategorySub: undefined,
    customTemplateCategory: undefined,
    customTemplateCategorySub: undefined,
    startButton: undefined,
    editButton: undefined,
    maxUpVotes: undefined,
    maxUpVotesHelp: undefined,
    maxDownVotes: undefined,
    maxDownVotesHelp: undefined,
    allowSelfVoting: undefined,
    allowSelfVotingHelp: undefined,
    allowMultipleVotes: undefined,
    allowMultipleVotesHelp: undefined,
    allowActions: undefined,
    allowActionsHelp: undefined,
    allowAuthorVisible: undefined,
    allowAuthorVisibleHelp: undefined,
    allowGiphy: undefined,
    allowGiphyHelp: undefined,
    allowGrouping: undefined,
    allowGroupingHelp: undefined,
    allowReordering: undefined,
    allowReorderingHelp: undefined,
    blurCards: undefined,
    blurCardsHelp: undefined,
    template: undefined,
    templateHelp: undefined,
    numberOfColumns: undefined,
    numberOfColumnsHelp: undefined,
    makeDefaultTemplate: undefined,
  },
  PostBoard: {
    customQuestion: undefined,
    notWellQuestion: 'Qué se podría mejorar?',
    wellQuestion: 'Qué ha ido bien?',
    ideasQuestion: 'Una brillante idea que compartir?',
    startQuestion: undefined,
    editButton: undefined,
    stopQuestion: undefined,
    continueQuestion: undefined,
    likedQuestion: undefined,
    lackedQuestion: undefined,
    learnedQuestion: undefined,
    longedForQuestion: undefined,
    anchorQuestion: undefined,
    boatQuestion: undefined,
    islandQuestion: undefined,
    windQuestion: undefined,
    rockQuestion: undefined,
    disconnected: undefined,
    reconnect: undefined,
    notLoggedIn: undefined,
  },
  GameMenu: {
    board: undefined,
    summary: undefined,
  },
  Template: {
    default: undefined,
    wellNotWell: undefined,
    startStopContinue: undefined,
    fourLs: undefined,
    sailboat: undefined,
  },
  Clients: {
    header: 'Acompañenos amablemente en este momento:',
  },
  Join: {
    welcome: 'Bienvenido a la retrospectiva',
    standardTab: {
      header: 'Crear una sesión',
      text: 'Pulse abajo y empieze la retrospectiva:',
      button: 'Crear una sesión nueva',
      customizeButton: undefined,
    },
    optionsTab: {
      header: 'Avanzado',
      input: 'inserte un nombre para su sesión',
      button: 'Crear una sesión personalizada',
    },
    previousTab: {
      header: 'Sesiones anteriores',
      rejoinButton: 'Reunirse',
    },
  },
  AnonymousLogin: {
    namePlaceholder: 'Quién eres exáctamente? Inserta tu nombre aquí',
    buttonLabel: 'Empezemos',
    header: 'Login',
    anonymousAuthHeader: undefined,
    anonymousAuthDescription: undefined,
    authenticatingWith: undefined,
    or: undefined,
  },
  SocialMediaLogin: {
    header: undefined,
    info: undefined,
  },
  AuthCommon: {
    emailField: undefined,
    passwordField: undefined,
    nameField: undefined,
    passwordScoreWords: undefined,
  },
  AccountLogin: {
    header: undefined,
    loginButton: undefined,
    info: undefined,
    registerLink: undefined,
    forgotPasswordLink: undefined,
    errorEmailPasswordIncorrect: undefined,
  },
  Register: {
    header: undefined,
    info: undefined,
    registerButton: undefined,
    errorAlreadyRegistered: undefined,
    errorGeneral: undefined,
    messageSuccess: undefined,
    errorInvalidEmail: undefined,
  },
  ValidateAccount: {
    success: undefined,
    error: undefined,
    loading: undefined,
  },
  ResetPassword: {
    // Reset Modal
    doneMessage: undefined,
    header: undefined,
    resetButton: undefined,
    info: undefined,
    // Reset Page
    success: undefined,
    error: undefined,
    loading: undefined,
    resetInfo: undefined,
  },
  SummaryBoard: {
    noPosts: 'No hay publicaciones que mostrar',
    copyAsMarkdown: undefined,
    copyAsRichText: undefined,
    copySuccessful: undefined,
  },
  SessionName: {
    defaultSessionName: 'Mi retrospectiva',
  },
  Invite: {
    inviteButton: 'Invitar',
    dialog: {
      title: 'Invitar personas a tu retrospectiva',
      text:
        'Para invitar otras personas a tu retrospectiva, sencillamente enviales ' +
        'la siguiente URL.',
      copyButton: 'Copiar la URL al Portapapeles',
    },
  },
  Generic: {
    ok: 'Ok',
    cancel: 'Cancelar',
  },
  Actions: {
    tooltip: 'Crear una acción',
    label: 'Abre el panel de acción.',
    summaryTitle: 'Tus acciones',
    title: 'Acción',
  },
  DeleteSession: {
    header: undefined,
    firstLine: undefined,
    secondLine: undefined,
    yesImSure: undefined,
    cancel: undefined,
  },
  RevealCards: {
    buttonLabel: undefined,
    dialogTitle: undefined,
    dialogContent: undefined,
    confirmButton: undefined,
    cancelButton: undefined,
  },
  AccountPage: {
    anonymousError: undefined,
    details: {
      header: undefined,
      username: undefined,
      email: undefined,
      accountType: undefined,
    },
    plan: {
      header: undefined,
      plan: undefined,
      youAreOwner: undefined,
      youAreMember: undefined,
    },
    subscription: {
      header: undefined,
      manageButton: undefined,
      membersEditor: {
        title: undefined,
        limitReached: undefined,
        info: undefined,
      },
    },
  },
} as Translation;
