import { render, screen } from '@testing-library/react'
import Headline from '@/components/Headline'

// 폰트 모킹
jest.mock('@/styles/fonts', () => ({
  oswald: { className: 'oswald-font' }
}))

describe('<Headline>', () => {
  test('Headline 컴포넌트가 정상적으로 렌더링된다', () => {
    render(<Headline />)
    const section = screen.getByTestId('headline')
    expect(section).toBeInTheDocument()
  })

  test('메인 제목이 정상적으로 렌더링된다', () => {
    render(<Headline />)

    // h1(heading) 요소가 존재하는지 확인 (level: 1)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()

    // oswald 폰트 클래스가 h1에 적용되어 있는지 확인
    expect(heading).toHaveClass('oswald-font')

    // 강조된 스팬 텍스트(OMDb API)가 보이는지 확인
    const emphasized = screen.getByText('OMDb API')
    expect(emphasized).toBeInTheDocument()
    // 강조 스팬의 클래스(컬러)가 적용되어 있는지 검사 (문자열 포함 검사)
    const span = emphasized.closest('span') ?? emphasized
    expect(span).toHaveClass('text-[var(--color-primary)]')

    // 본문(문단)에 적어둔 문장이 일부라도 렌더되는지 확인
    expect(
      screen.getByText(
        /The OMDb API is a RESTful web service to obtain movie information/i
      )
    ).toBeInTheDocument()
  })
})
