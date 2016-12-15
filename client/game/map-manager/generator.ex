defmodule DungeonGenerator do
  defstruct matrix: %{}, size: 0

  defp create_matrix(size: n) do
    columns = 0..(n * n - 1)
      |> Enum.reduce(%{}, fn(x, acc) -> acc |> Map.put(x, 0) end)

    m = 0..(n * n - 1)
      |> Enum.reduce(%{}, fn(x, acc) -> acc |> Map.put(x, columns) end)

    %DungeonGenerator{ matrix: m, size: n }
  end

  defp add_directed_connection(matrix, a, b) do
    matrix
      |> Map.update!(a, fn(i) ->
        i
          |> Map.update!(b, fn(i) -> i + 1 end)
      end)
  end

  defp add_connection(matrix, a, b) do
    matrix
      |> add_directed_connection(a, b)
      |> add_directed_connection(b, a)
  end

  defp remove_connection(matrix, a, b) do
    matrix
      |> Map.update!(a, fn(i) ->
        i
          |> Map.update!(b, fn
            i when i > 0 -> i - 1
            i when i <= 0 -> i
          end)
      end)
      |> Map.update!(b, fn(i) ->
        i
          |> Map.update!(a, fn
            i when i > 0 -> i - 1
            i when i <= 0 -> i
          end)
      end)
  end

  defp get_neighbors(i, n) do
    x = rem(i, n)
    y = trunc(i / n)

    [%{ x: x + 1, y: y }, %{ x: x - 1, y: y }, %{ x: x, y: y + 1 }, %{ x: x, y: y - 1 }]
      |> Enum.reject(fn(%{ x: i }) -> i < 0 end)
      |> Enum.reject(fn(%{ y: j }) -> j < 0 end)
      |> Enum.reject(fn(%{ x: i }) -> i >= n end)
      |> Enum.reject(fn(%{ y: j }) -> j >= n end)
      |> Enum.map(fn(%{ x: i, y: j }) -> i + n * j end)
  end

  defp add_adjacent_connections(%DungeonGenerator{matrix: m, size: n}) do
    m = 0..(n * n - 1)
      |> Enum.map(fn(x) -> get_neighbors(x, n) end)
      |> Enum.with_index
      |> Enum.map(fn({neighbors, i}) -> neighbors |> Enum.map(fn(n) -> { i, n} end) end)
      |> List.flatten
      |> Enum.reduce(m, fn({a, b}, acc) -> add_directed_connection(acc, a, b) end)

    %DungeonGenerator{ matrix: m, size: n }
  end

  defp add_horizontal_connections(%DungeonGenerator{matrix: m, size: n}) do
    m = 0..(n * n - 1)
      |> Enum.map(fn(x) -> {x, x + 1} end)
      |> Enum.reject(fn({_, next}) -> rem(next, n) == 0 end)
      |> Enum.reduce(m, fn({a, b}, acc) -> add_connection(acc, a, b) end)

    %DungeonGenerator{ matrix: m, size: n }
  end

  defp add_vertical_connections(%DungeonGenerator{matrix: m, size: n}) do
    m = 0..(n * n - 1)
      |> Enum.map(fn(x) -> {x, x + n} end)
      |> Enum.reject(fn({_, next}) -> next > n * n - 1 end)
      |> Enum.chunk(n)
      |> Enum.map(fn(x) -> x |> Enum.random end)
      |> Enum.reduce(m, fn({a, b}, acc) -> add_connection(acc, a, b) end)

    %DungeonGenerator{ matrix: m, size: n }
  end

  defp shuffle(%DungeonGenerator{matrix: m, size: n}) do
    {a, b} = m
      |> Enum.to_list
      |> Enum.map(fn({x, l}) ->
        y = l
          |> Enum.to_list
          |> Enum.filter(fn({_, v}) -> v == 2 end)
          |> Enum.map(fn({y, _}) -> y end)
        {x, y}
      end)
      |> Enum.reject(fn({_, y}) -> length(y) > 1 end)
      |> Enum.map(fn({x, [y]}) -> {x, y} end)
      |> Enum.random

    c = get_neighbors(a, n)
      |> Enum.random

    m = m
      |> remove_connection(a, b)
      |> add_connection(a, c)

    %DungeonGenerator{matrix: m, size: n}
  end

  def prune(%DungeonGenerator{matrix: m, size: n}) do
    {a, b} = m
      |> Enum.to_list
      |> Enum.map(fn({x, l}) ->
        y = l
          |> Enum.to_list
          |> Enum.filter(fn({_, v}) -> v == 2 end)
          |> Enum.map(fn({y, _}) -> y end)
        {x, y}
      end)
      |> Enum.filter(fn({_, y}) -> length(y) == 1 end)
      |> Enum.map(fn({x, [y]}) -> {x, y} end)
      |> Enum.random

    m = m
      |> remove_connection(a, b)

    %DungeonGenerator{matrix: m, size: n}
  end

  def print(%DungeonGenerator{matrix: m, size: n}) do
    str = m
      |> Enum.to_list
      |> Enum.map(fn({k, x}) -> {k, x |> Enum.to_list} end)
      |> Enum.map(fn({k, x}) -> {k, x |> Enum.reject(fn({_, y}) -> y < 2 end)} end)
      |> Enum.map(fn({k, x}) -> {k, x |> Enum.map(fn({y, _}) -> y end)} end)
      |> Enum.map(fn({k, x}) -> x |> Enum.map(fn(y) -> { k, y } end) end)
      |> List.flatten
      |> Enum.reject(fn({a, b}) -> b - a < 0 end)
      |> Enum.map(fn({a, b}) -> "#{a} #{b}" end)
      |> Enum.join(", ")

    "#{n}, #{str}"
      |> IO.puts
  end

  def print2(%DungeonGenerator{matrix: m, size: _}) do
    m
      |> Enum.to_list
      |> Enum.map(fn({k, v}) -> {k, v |> Enum.to_list} end)
      |> Enum.map(fn({k, v}) -> {k, v |> Enum.filter(fn({_, conns}) -> conns > 1 end)} end)
      |> Enum.map(fn({x, v}) -> {x, v |> Enum.map(fn({x, _}) -> x end)} end)
      |> Enum.map(fn({x, y}) -> {x, y |> Enum.join(", ")} end)
      |> Enum.map(fn({x, y}) -> "#{x}: #{y}" end)
      |> Enum.join("\n")
      # |> Enum.map(fn({x, {y, v}}) -> {x, y} end)
      |> IO.puts
  end

  def generate(size: n) do
    m = create_matrix(size: n)
      |> add_adjacent_connections
      |> add_horizontal_connections
      |> add_vertical_connections

    m = 0..1000
      |> Enum.reduce(m, fn(_, acc) -> shuffle(acc) end)

    1..:rand.uniform(trunc(n / 2))
      |> Enum.reduce(m, fn(_, acc) -> prune(acc) end)
  end
end

size = System.argv |> hd |> String.to_integer
DungeonGenerator.generate(size: size)
  |> DungeonGenerator.print2
