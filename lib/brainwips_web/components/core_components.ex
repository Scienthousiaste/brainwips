defmodule BrainwipsWeb.CoreComponents do
  @moduledoc """
  Provides core UI components.
  """
  use Phoenix.Component

  import BrainwipsWeb.Gettext

  @doc """
  A button to starts a named experiment - when clicked, displays a canvas on
  a large modal that covers most of the screen.
  """
  attr :text, :string, required: true
  attr :run, :string, required: true

  def focus_prompt(assigns) do
    ~H"""
    <button
      class="focus-prompt"
      data-run={@run}>
      <%= @text %>
    </button>
    """
  end
end
