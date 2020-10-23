import apiClient from "./apiClient";

export type PostType = "board" | "replies";

export interface QnaComment {
  id: number;
  username: string;
  member_name: string;
  text: string;
  created_at: string;
  updated_at: string;
  is_author?: boolean;
}

export interface QnaPost {
  id: number;
  username: string;
  member_name: string;
  title?: string;
  text: string;
  tags?: string[];
  view?: number;
  recommend: number;
  answer: boolean;
  accepted?: boolean;
  created_at: string;
  updated_at: string;
  comments?: QnaComment[];
}

export interface ApiComment {
  id: number;
  username: string;
  member_name: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface ApiBoard {
  id: number;
  username: string;
  member_name: string;
  title: string;
  body: string;
  tags: {
    id: number;
    body: string;
  }[];
  view: number;
  recommend: number;
  created_at: string;
  updated_at: string;
}

export interface ApiReply {
  id: number;
  username: string;
  adopted: number;
  recommend: number;
  body: string;
  member_name: string;
  created_at: string;
  updated_at: string;
}

export interface CoreState {
  posts: QnaPost[];
}

export interface ApiBoardResponse {
  data: {
    totalPage: number;
    boards: ApiBoard[];
  };
}

export interface ApiBoardSpecificResponse {
  data: ApiBoard;
}

export interface ApiRepliesResponse {
  data: ApiReply[];
}

export interface ApiCommentResponse {
  data: ApiComment[];
}

const buildQnaPostFromApiBoard = (board: ApiBoard): QnaPost => ({
  id: board.id,
  username: board.username,
  member_name: board.member_name,
  title: board.title,
  text: board.body,
  tags: board.tags.map((tag) => tag.body).sort(),
  view: board.view,
  recommend: board.recommend,
  created_at: board.created_at,
  updated_at: board.updated_at,
  answer: false,
});

const buildQnaPostFromApiReplies = (reply: ApiReply): QnaPost => ({
  id: reply.id,
  username: reply.username,
  member_name: reply.member_name,
  text: reply.body,
  recommend: reply.recommend,
  created_at: reply.created_at,
  updated_at: reply.updated_at,
  answer: true,
  accepted: !!reply.adopted,
});

const buildQnaCommentFromApiComment = (reply: ApiComment): QnaComment => ({
  id: reply.id,
  username: reply.username,
  member_name: reply.member_name,
  text: reply.body,
  created_at: reply.created_at,
  updated_at: reply.updated_at,
});

export const getPost = async (postId: string | number): Promise<QnaPost> => {
  const {
    data: { data: board },
  } = await apiClient.get<ApiBoardSpecificResponse>(
    `/board/specific/${postId}`,
  );

  return buildQnaPostFromApiBoard(board);
};

export const getReplies = async (
  postId: string | number,
): Promise<QnaPost[]> => {
  const {
    data: { data: replies },
  } = await apiClient.get<ApiRepliesResponse>(`/replies/${postId}`);

  return replies.map((repl) => buildQnaPostFromApiReplies(repl));
};

export const getRecentPosts = async (
  page: number,
): Promise<{ totalPage: number; posts: QnaPost[] }> => {
  const {
    data: {
      data: { totalPage, boards },
    },
  } = await apiClient.get<ApiBoardResponse>(`/board/${page}`);

  return {
    totalPage,
    posts: boards.map((board) => buildQnaPostFromApiBoard(board)),
  };
};

export const getComments = async (
  type: PostType,
  postId: number,
): Promise<QnaComment[]> => {
  const url = `/${type}comment/${postId}`;

  const {
    data: { data: comments },
  } = await apiClient.get<ApiCommentResponse>(url);

  return comments.map((comment) => buildQnaCommentFromApiComment(comment));
};

export const writeComment = async (
  type: PostType,
  postId: number,
  text: string,
): Promise<void> => {
  const url = `/${type}comment/${postId}`;

  await apiClient.post(url, {
    body: text,
  });
};

export const writePost = async (
  text: string,
  title: string,
  tags: string[],
): Promise<QnaPost> => {
  const {
    data: { data: board },
  } = await apiClient.post<ApiBoardSpecificResponse>("/board", {
    body: text,
    title,
    tag: tags.join(" "),
  });

  return buildQnaPostFromApiBoard(board);
};

export const editPost = async (
  text: string,
  title: string,
  tags: string[],
): Promise<QnaPost> => {
  const {
    data: { data: board },
  } = await apiClient.put<ApiBoardSpecificResponse>("/board", {
    body: text,
    title,
    tag: tags.join(" "),
  });

  return buildQnaPostFromApiBoard(board);
};

export const accept = async (postId: number) => {
  await apiClient.put(`/replies/adopted/${postId}`);
};
