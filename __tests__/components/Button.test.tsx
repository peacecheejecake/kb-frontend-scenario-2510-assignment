import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '@/components/Button'

const primaryColorClass = 'bg-[var(--color-primary)]'

describe('<Button>', () => {
  test('기본 버튼이 정상적으로 렌더링된다', () => {
    render(<Button>버튼</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  test('children props이 정상적으로 표시된다', () => {
    render(<Button>버튼</Button>)
    expect(screen.getByText('버튼')).toBeInTheDocument()
  })

  test('color prop이 없을 때 기본 스타일이 적용된다', () => {
    render(<Button>버튼</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-') // 기본 배경색 클래스가 들어있다고 가정
  })

  test('loading 상태일 때 Loader 컴포넌트가 표시된다', () => {
    render(<Button loading>버튼</Button>)
    const loader = screen.getByTestId('loader')
    expect(loader).toBeInTheDocument()
  })

  test('loading 상태일 때 Loader에 올바른 props가 전달된다', () => {
    const color = 'red'
    render(
      <Button
        loading
        loadingColor={color}>
        버튼
      </Button>
    )
    const loader = screen.getByTestId('loader')
    expect(loader).toHaveAttribute('borderColor', color)
  })

  test('loading 상태일 때 children이 숨겨진다', () => {
    render(<Button loading>버튼</Button>)
    const button = screen.getByRole('button')
    expect(button).not.toHaveTextContent('버튼')
  })

  test('loading이 false일 때 children이 표시되고 Loader는 숨겨진다', () => {
    render(<Button loading={false}>버튼</Button>)
    expect(screen.getByText('버튼')).toBeInTheDocument()
    const loader = screen.queryByTestId('loader')
    expect(loader).not.toBeInTheDocument()
  })

  test('onClick 이벤트 핸들러가 올바르게 동작한다', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>버튼</Button>)

    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('color prop이 올바르게 적용된다', () => {
    render(<Button color="primary">버튼</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain(primaryColorClass)
  })
})
