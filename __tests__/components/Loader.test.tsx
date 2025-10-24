import { render, screen } from '@testing-library/react'
import Loader from '@/components/Loader'

describe('<Loader>', () => {
  test('기본 컴포넌트가 정상적으로 렌더링된다', () => {
    render(<Loader />)
    const loader = screen.getByTestId('loader')
    expect(loader).toBeInTheDocument()
  })

  test('size props를 사용하지 않으면 기본 크기가 적용된다', () => {
    // 컴포넌트의 기본 size는 20 (Loader.tsx의 default)
    render(<Loader />)
    const loader = screen.getByTestId('loader')
    expect(loader).toBeInTheDocument()
    expect(loader.style.width).toBe('20px')
    expect(loader.style.height).toBe('20px')
  })

  test('size props를 사용하면 해당 크기가 적용된다', () => {
    const size = 41
    render(<Loader size={size} />)
    const loader = screen.getByTestId('loader')
    expect(loader).toBeInTheDocument()
    expect(loader.style.width).toBe(`${size}px`)
    expect(loader.style.height).toBe(`${size}px`)
  })

  test('color props를 사용하지 않으면 기본 색상이 적용된다', () => {
    // 기본 color는 'primary'이고 Loader.tsx에서 primary => '#FDC000'
    render(<Loader />)
    const loader = screen.getByTestId('loader')
    expect(loader).toBeInTheDocument()
    expect(loader.style.borderColor).toBe('#FDC000')
  })

  test('color props를 사용하면 해당 색상이 적용된다', () => {
    const custom = '#FF5733'
    render(<Loader color={custom} />)
    const loader = screen.getByTestId('loader')
    expect(loader).toBeInTheDocument()
    expect(loader.style.borderColor).toBe(custom)
  })

  test('loading props가 false일 때 렌더링되지 않는다', () => {
    render(<Loader loading={false} />)
    const loader = screen.queryByTestId('loader')
    expect(loader).toBeNull()
  })

  test('loading props가 true일 때 렌더링된다', () => {
    render(<Loader loading={true} />)
    const loader = screen.getByTestId('loader')
    expect(loader).toBeInTheDocument()
  })
})
