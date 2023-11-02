defmodule BrainwipsWeb.SplitAttentionController do
  use BrainwipsWeb, :controller

  def split_attention(conn, _params) do
    render(conn, :split_attention)
  end
end
