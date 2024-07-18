import { Todo } from '../../types/Todo';
import { ToDo } from '../ToDo/ToDo';

type Props = {
  todos: Todo[];
  idTodo: number;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (todo: Todo) => Promise<void>;
  onLoading: (status: boolean) => void;
  onError: (status: string) => void;
  onIdTodo: (id: number) => void;
};

export const ToDoList: React.FC<Props> = ({
  todos,
  idTodo,
  onDelete,
  onUpdate,
  onLoading,
  onError,
  onIdTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <ToDo
          todos={todos}
          todo={todo}
          key={todo.id}
          idTodo={idTodo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onLoading={onLoading}
          onError={onError}
          onIdTodo={onIdTodo}
        />
      ))}
    </section>
  );
};
